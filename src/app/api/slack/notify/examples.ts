/**
 * Exemplos de uso da API de notificações do Slack
 *
 * Este arquivo contém exemplos de como enviar notificações para o Slack
 * usando a API /api/slack/notify
 */

/**
 * Função auxiliar para enviar notificações ao Slack
 */
export async function sendSlackNotification(options: {
  message: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
  context?: string;
  metadata?: Record<string, unknown>;
  channel?: string;
  username?: string;
  iconEmoji?: string;
  timeoutMs?: number;
}): Promise<{ ok: boolean; error?: string; warning?: string }> {
  try {
    const response = await fetch('/api/slack/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar notificação para o Slack:', error);
    return { ok: false, error: 'Falha na requisição' };
  }
}

// Exemplo 1: Notificação básica
export async function exampleBasicNotification() {
  return sendSlackNotification({
    message: 'Teste de notificação básica',
    level: 'info',
    context: 'ExampleApp',
  });
}

// Exemplo 2: Notificação de erro com metadados
export async function exampleErrorWithMetadata() {
  return sendSlackNotification({
    message: 'Erro ao processar pagamento',
    level: 'error',
    context: 'PaymentService',
    metadata: {
      orderId: '12345',
      paymentMethod: 'credit_card',
      amount: 99.99,
      errorDetails: 'Cartão recusado pela operadora',
    },
  });
}

// Exemplo 3: Notificação para canal específico com identidade personalizada
export async function exampleCustomChannelNotification() {
  return sendSlackNotification({
    message: 'Alerta de segurança: Tentativas excessivas de login',
    level: 'warn',
    context: 'SecurityMonitor',
    channel: '#seguranca',
    username: 'Security Bot',
    iconEmoji: ':lock:',
    metadata: {
      ipAddress: '192.168.1.1',
      attempts: 5,
      username: 'admin',
      timestamp: new Date().toISOString(),
    },
  });
}

// Exemplo 4: Notificação de sucesso com timeout personalizado
export async function exampleSuccessNotification() {
  return sendSlackNotification({
    message: 'Implantação concluída com sucesso',
    level: 'info',
    context: 'DeploymentService',
    channel: '#deploys',
    username: 'Deploy Bot',
    iconEmoji: ':rocket:',
    timeoutMs: 10000, // 10 segundos
    metadata: {
      version: '1.2.3',
      environment: 'production',
      deployTime: '45s',
      changes: '15 arquivos alterados',
    },
  });
}

// Exemplo 5: Uso no contexto de tratamento de erros
export async function exampleErrorHandling() {
  try {
    // Simulação de uma operação que pode falhar
    const result = await fetchData();
    return result;
  } catch (error) {
    // Envia notificação em caso de erro
    await sendSlackNotification({
      message: `Erro ao buscar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      level: 'error',
      context: 'DataFetchService',
      metadata: {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
        timestamp: new Date().toISOString(),
      },
    });

    // Re-lança o erro para tratamento adicional
    throw error;
  }
}

// Função auxiliar para o exemplo 5
async function fetchData() {
  // Simulação de uma função que busca dados
  throw new Error('API indisponível');
}
