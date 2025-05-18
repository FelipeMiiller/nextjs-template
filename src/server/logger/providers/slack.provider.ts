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

  // Utilitário local para sanitizar e truncar texto para Slack Block Kit
  private slackSafe(text: string, max = 2900): string {
    // Função recursiva para buscar propriedades importantes
    function extractImportant(obj: any, prefix = ''): string {
      let out = '';
      if (!obj || typeof obj !== 'object') return '';
      if (obj.message) out += `${prefix}*Mensagem:* ${obj.message}\n`;
      //if (obj.stack) out += `${prefix}*Stack:*\n\n${obj.stack}\n\n`;
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
      const obj = typeof text === 'string' ? JSON.parse(text) : text;
      if (obj && typeof obj === 'object') {
        formatted = extractImportant(obj);
        if (!formatted) formatted = text;
      } else {
        formatted = text;
      }
    } catch {
      formatted = text;
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
    // if (logLevels && !logLevels.includes(level)) {
    //   return;
    // }

    try {
      // Log temporário para debug
      console.log('Slack metadata:', JSON.stringify(metadata, null, 2));
      const timestampStr = timestamp.toISOString();
      const title = `[${level.toUpperCase()}] ${context || 'Application'}`;

      // Formata a mensagem principal
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

      // Bloco resumo com campos principais
      const summaryFields = [
        metadata.errorName ? `*Nome do erro:* ${metadata.errorName}` : null,
        metadata.errorMessage ? `*Mensagem do erro:* ${metadata.errorMessage}` : null,
        metadata.errorCode ? `*Código do erro:* ${metadata.errorCode}` : null,
        metadata.statusCode ? `*Status code:* ${metadata.statusCode}` : null,
        metadata.requestId ? `*RequestId:* ${metadata.requestId}` : null,
        metadata.userId ? `*UserId:* ${metadata.userId}` : null,
        metadata.sessionId ? `*SessionId:* ${metadata.sessionId}` : null,
        `*Ambiente:* ${environment}`,

        `*Data/Hora:* ${timestampStr}`,
      ].filter(Boolean);
      if (summaryFields.length > 0) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: summaryFields.join('\n'),
          },
        });
      }

      // Metadados completos (detalhes técnicos) - sem rawError, truncando campos grandes
      const metadataEntries = Object.entries(metadata).filter(
        ([key]) =>
          ![
            'stackTrace',
            'rawError',
            'errorName',
            'errorMessage',
            'errorCode',
            'statusCode',
            'requestId',
            'userId',
            'sessionId',
          ].includes(key),
      );
      if (metadataEntries.length > 0) {
        const metadataText = metadataEntries
          .map(([key, value]) => {
            let val: string;
            if (typeof value === 'string') {
              val = value;
            } else if (value === undefined || value === null) {
              val = String(value);
            } else {
              try {
                val = JSON.stringify(value);
              } catch {
                val = '[Unserializable value]';
              }
            }
            if (val.length > 500) val = val.slice(0, 500) + '... [truncated]';
            return `• *${key}*: \`${val}\``;
          })
          .join('\n');
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Detalhes técnicos*\n${metadataText}\n_Veja detalhes completos no log do servidor._`,
          },
        });
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

      // 1. Mensagem principal
      await this.webhook.send({
        text: `${title}: ${message}`,
        blocks,
        icon_emoji: this.config.iconEmoji,
        username: this.config.username,
      });

      // 2. Stack trace (mensagem separada)
      if (stackTrunc) {
        await this.webhook.send({
          text: `${title}: Stack Trace`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Stack Trace:*\n\`\`\`\n${stackTrunc}\n\`\`\``,
              },
            },
          ],
          icon_emoji: this.config.iconEmoji,
          username: this.config.username,
        });
      }

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

      if (rawTrunc) {
        const rawBlocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Raw Error (truncado):*\n${this.slackSafe(rawTrunc)}`,
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
