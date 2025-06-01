/**
 * SlackEdgeNotificationProvider
 * Provider para envio de mensagens ao Slack usando apenas fetch (compatível com Node.js, Edge e Middleware Next.js)
 *
 * Exemplo de uso:
 * const slack = new SlackEdgeNotificationProvider({ webhookUrl: process.env.SLACK_WEBHOOK_URL! });
 * await slack.notify({ message: 'Erro crítico!', level: 'error' });
 */

export type SlackEdgeProviderConfig = {
  webhookUrl: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
  environment?: string;
  timeoutMs?: number;
};

export type SlackEdgeNotifyParams = {
  message: string;
  level?: string;
  context?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
};

export class SlackEdgeNotificationProvider {
  private readonly config: Required<SlackEdgeProviderConfig>;

  constructor(config: SlackEdgeProviderConfig) {
    if (!config.webhookUrl) throw new Error('Slack webhook URL is required');
    this.config = {
      channel: config.channel || '#logs',
      username: config.username || 'Logger Bot',
      iconEmoji: config.iconEmoji || ':robot_face:',
      environment: config.environment || process.env.NODE_ENV || 'development',
      timeoutMs: config.timeoutMs || 5000,
      webhookUrl: config.webhookUrl,
    };
  }

  /**
   * Envia uma notificação para o Slack via fetch
   */
  async notify(params: SlackEdgeNotifyParams): Promise<void> {
    const { message, level = 'info', context, metadata = {}, timestamp = new Date() } = params;
    const { channel, username, iconEmoji, environment, webhookUrl } = this.config;

    const title = `:information_source: [${environment.toUpperCase()}] [${level.toUpperCase()}]`;
    const summary = [
      `*Mensagem:* ${message}`,
      context ? `*Contexto:* ${context}` : '',
      `*Timestamp:* ${timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    ]
      .filter(Boolean)
      .join('\n');

    const metaBlock =
      metadata && Object.keys(metadata).length > 0
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Metadata:*\n\`\n${JSON.stringify(metadata, null, 2).slice(0, 1800)}\n\``,
              },
            },
          ]
        : [];

    const body = {
      channel,
      username,
      icon_emoji: iconEmoji,
      text: `${title}: ${message}`,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: summary },
        },
        ...metaBlock,
      ],
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        console.error('Erro ao enviar mensagem para o Slack:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem para o Slack:', error);
    }
  }
}
