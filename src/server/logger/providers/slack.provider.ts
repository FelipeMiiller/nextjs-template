import 'server-only';
import { IncomingWebhook } from '@slack/webhook';
import { LogLevel } from '../types';

interface SlackNotificationProviderConfig {
  /** URL do webhook do Slack */
  webhookUrl: string;
  /** Canal padrão para envio das mensagens */
  channel?: string;
  /** Nome de exibição do bot */
  username?: string;
  /** Emoji para o ícone do bot */
  iconEmoji?: string;
  /** Nome do ambiente (ex: development, production) */
  environment?: string;
  /** Timeout para envio das mensagens (em ms) */
  timeout?: number;
  /** Níveis de log que devem ser notificados */
  logLevels?: LogLevel[];
}

/**
 * Provedor de notificações para o Slack usando a API oficial
 */
export class SlackNotificationProvider {
  private readonly config: Required<SlackNotificationProviderConfig>;
  private webhook: IncomingWebhook;

  constructor(
    private readonly webhookUrl: string,
    private readonly channel: string = (process.env.SLACK_CHANNEL?.startsWith('#')
      ? process.env.SLACK_CHANNEL
      : `#${process.env.SLACK_CHANNEL}`) || '#logs',
    private readonly username: string = process.env.SLACK_USERNAME || 'Logger Bot',
    private readonly iconEmoji: string = process.env.SLACK_ICON_EMOJI || ':robot_face:',
    private readonly environment: string = process.env.NODE_ENV || 'development',
  ) {
    if (!this.webhookUrl) {
      throw new Error('Slack webhook URL is required');
    }

    this.config = {
      channel: this.channel,
      username: this.username,
      iconEmoji: this.iconEmoji,
      environment: this.environment,
      timeout: 5000, // 5 segundos
      logLevels: [LogLevel.ERROR, LogLevel.WARN],
      webhookUrl: this.webhookUrl,
    };

    // Inicializa o cliente do webhook do Slack
    this.webhook = new IncomingWebhook(this.config.webhookUrl, {
      channel: this.config.channel,
      username: this.config.username,
      icon_emoji: this.config.iconEmoji,
    });
  }

  /**
   * Utilitário para sanitizar e truncar texto para Slack Block Kit
   * Processa objetos de erro para extrair informações importantes
   * @private
   */
  private slackSafe(text: string | unknown, max = 2900): string {
    // Função recursiva para buscar propriedades importantes
    function extractImportant(obj: any, prefix = ''): string {
      let out = '';
      if (!obj || typeof obj !== 'object') return '';
      if (obj.message) out += `${prefix}*Mensagem:* ${obj.message}\n`;
      if (obj.cause) {
        if (typeof obj.cause === 'object') {
          out += extractImportant(obj.cause, prefix + '→ ');
        } else {
          out += `${prefix}*Cause:* ${obj.cause}\n`;
        }
      }
      return out;
    }

    let formatted = '';
    try {
      // Tenta converter para objeto se for string JSON
      const obj = typeof text === 'string' ? JSON.parse(text) : text;

      if (obj && typeof obj === 'object') {
        // Extrai informações importantes do objeto
        formatted = extractImportant(obj);
        // Se não conseguiu extrair nada, converte o objeto para string
        if (!formatted) {
          formatted = typeof obj === 'string' ? obj : JSON.stringify(obj);
        }
      } else {
        // Garante que o valor seja string
        formatted = typeof obj === 'string' ? obj : String(obj ?? '');
      }
    } catch {
      // Em caso de erro, converte o valor original para string
      formatted = typeof text === 'string' ? text : String(text ?? '');
    }
    // Sanitização e truncamento
    let safe = (formatted || '')
      .replace(/```/g, "'''")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\r\n|\r|\n/g, '\n');
    safe = safe.replace(/\n{3,}/g, '\n\n');
    safe = safe
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
    if (safe.length > max) safe = safe.slice(0, max) + '\n[truncated]';
    return safe;
  }

  /**
   * Envia uma notificação para o Slack
   */
  async notify(params: {
    level: LogLevel;
    message: string;
    context?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
  }): Promise<void> {
    const { level, message, context, metadata = {}, timestamp } = params;
    const { environment, logLevels } = this.config;

    // Verifica se o nível de log está configurado para notificação
    if (logLevels && !logLevels.includes(level)) {
      return;
    }

    try {
      // Log temporário para debug

      const timestampStr = timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const title = `[${level.toUpperCase()}] ${context || 'Application'}`;

      // Formata a mensagem principal - apenas informações essenciais
      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `[${level.toUpperCase()}] ${context || 'Application'}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Mensagem:* ${message}`,
          },
        },
      ] as any[];

      // Apenas informações essenciais para entender o erro
      const essentialFields = [
        metadata.errorName ? `*Tipo:* ${metadata.errorName}` : null,
        metadata.errorMessage ? `*Detalhe:* ${metadata.errorMessage}` : null,
        metadata.errorCode || metadata.code
          ? `*Código:* ${metadata.errorCode || metadata.code}`
          : null,
        metadata.statusCode ? `*Status:* ${metadata.statusCode}` : null,
        metadata.path ? `*Path:* ${metadata.path}` : null,
        metadata.method ? `*Método:* ${metadata.method}` : null,
        `*Ambiente:* ${environment}`,
        `*Data/Hora:* ${timestampStr}`,
      ].filter(Boolean);

      if (essentialFields.length > 0) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: essentialFields.join('\n'),
          },
        });
      }

      // Adiciona causa do erro se existir (importante para entender a origem)
      if (metadata.cause) {
        let causeText = '';
        try {
          causeText =
            typeof metadata.cause === 'string'
              ? metadata.cause
              : JSON.stringify(metadata.cause, null, 2);

          if (causeText.length > 500) {
            causeText = causeText.slice(0, 500) + '... [truncated]';
          }

          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Causa:*\n\`\`\`\n${causeText}\n\`\`\``,
            },
          });
        } catch {}
      }

      // Stack trace destacado (até 4000 caracteres)
      let stackTrunc = '';
      if (metadata.stackTrace && String(metadata.stackTrace).trim() !== '') {
        const stack = String(metadata.stackTrace);
        stackTrunc = stack.length > 3900 ? stack.slice(0, 3900) + '\n[truncated]' : stack;
      }
      let rawTrunc = '';
      if (metadata.rawError && String(metadata.rawError).trim() !== '') {
        const raw = String(metadata.rawError);
        rawTrunc = raw.length > 3900 ? raw.slice(0, 3900) + '\n[truncated]' : raw;
      }

      // Envia a mensagem principal com os blocos de informação
      await this.webhook.send({
        text: `${title}: ${message}`,
        blocks,
        icon_emoji: this.config.iconEmoji,
        username: this.config.username,
      });

      // Envia stack trace em mensagem separada (se existir)
      if (stackTrunc) {
        const stackBlocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Stack Trace:*\n\`\`\`\n${this.slackSafe(stackTrunc)}\n\`\`\``,
            },
          },
        ];
        await this.webhook.send({
          text: `${title}: Stack Trace`,
          blocks: stackBlocks,
          icon_emoji: this.config.iconEmoji,
          username: this.config.username,
        });
      }

      // Envia erro bruto em mensagem separada (se existir)
      if (rawTrunc) {
        const rawBlocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Raw Error:*\n\`\`\`\n${this.slackSafe(rawTrunc)}\n\`\`\``,
            },
          },
        ];
        await this.webhook.send({
          text: `${title}: Raw Error`,
          blocks: rawBlocks,
          icon_emoji: this.config.iconEmoji,
          username: this.config.username,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar notificação para o Slack:', error);
      // Tenta registrar o erro no console como fallback
      console.error('Falha na notificação do Slack:', {
        level,
        message,
        context,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
