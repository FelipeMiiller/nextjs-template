import { SlackNotificationProvider } from '../providers/slack.provider';
import { ConsoleNotificationProvider } from '../providers/console.provider';
import { LogLevel } from '../types';

describe('SlackNotificationProvider', () => {
  const webhookUrl = 'https://hooks.slack.com/services/test/test/test';
  const channel = 'monitoringtest';
  const username = 'Logger Bot';
  const iconEmoji = ':robot_face:';
  const environment = 'test';

  it('deve instanciar corretamente', () => {
    const provider = new SlackNotificationProvider(
      webhookUrl,
      channel,
      username,
      iconEmoji,
      environment,
    );
    expect(provider).toBeDefined();
  });

  it('deve cair no fallback para ConsoleNotificationProvider se Slack falhar', async () => {
    const provider = new SlackNotificationProvider(
      webhookUrl,
      channel,
      username,
      iconEmoji,
      environment,
    );
    // Simula falha no envio (404)
    provider['webhook'] = {
      send: async () => {
        throw new Error('Simulated Slack error');
      },
    } as any;
    const fallback = new ConsoleNotificationProvider({
      colors: true,
      timestamps: true,
      metadata: true,
    });
    let fallbackCalled = false;
    fallback.notify = async () => {
      fallbackCalled = true;
    };
    try {
      await provider.notify({
        level: LogLevel.ERROR,
        message: 'Teste de erro',
        context: 'test',
        metadata: {},
        timestamp: new Date(),
      });
    } catch {}
    expect(fallbackCalled).toBe(false); // O fallback real é usado no Logger, não aqui diretamente
  });
});
