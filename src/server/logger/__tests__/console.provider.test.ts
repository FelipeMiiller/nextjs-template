import { ConsoleNotificationProvider } from '../providers/console.provider';
import { LogLevel } from '../types';

describe('ConsoleNotificationProvider', () => {
  it('deve instanciar e notificar sem erros', async () => {
    const provider = new ConsoleNotificationProvider({
      colors: true,
      timestamps: true,
      metadata: true,
    });
    await expect(
      provider.notify({
        level: LogLevel.INFO,
        message: 'Mensagem de teste',
        context: 'test',
        metadata: { foo: 'bar' },
        timestamp: new Date(),
      }),
    ).resolves.not.toThrow();
  });
});
