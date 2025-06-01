# API de Notificações para Slack

Esta API permite enviar notificações para o Slack diretamente do cliente, com suporte para personalização de canal, usuário e outros parâmetros.

## Endpoint

```
POST /api/slack/notify
```

## Configuração

A API requer as seguintes variáveis de ambiente:

- `SLACK_WEBHOOK_URL` (obrigatório): URL do webhook do Slack
- `SLACK_CHANNEL` (opcional): Canal padrão para mensagens
- `SLACK_USERNAME` (opcional): Nome de usuário padrão do bot
- `SLACK_ICON_EMOJI` (opcional): Emoji padrão para o ícone do bot
- `NODE_ENV`: Ambiente (development, production, etc.)

## Parâmetros da Requisição

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `message` | string | Sim | Mensagem a ser enviada |
| `level` | string | Não | Nível do log (info, warn, error, debug) |
| `context` | string | Não | Contexto da mensagem |
| `metadata` | object | Não | Metadados adicionais |
| `channel` | string | Não | Canal específico (sobrescreve a variável de ambiente) |
| `username` | string | Não | Nome de usuário do bot (sobrescreve a variável de ambiente) |
| `iconEmoji` | string | Não | Emoji para o ícone do bot (sobrescreve a variável de ambiente) |
| `timeoutMs` | number | Não | Timeout da requisição em milissegundos |

## Resposta

### Sucesso

```json
{
  "ok": true
}
```

### Erro

```json
{
  "error": "Mensagem de erro",
  "status": 400
}
```

### Webhook não configurado

```json
{
  "ok": false,
  "warning": "Slack não configurado"
}
```

## Exemplos de Uso

Veja o arquivo `examples.ts` para exemplos completos de como usar esta API.

### Exemplo Básico

```typescript
fetch('/api/slack/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Teste de notificação',
    level: 'info',
    context: 'ExampleApp'
  })
})
```

### Exemplo com Canal Personalizado

```typescript
fetch('/api/slack/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Alerta de segurança',
    level: 'warn',
    context: 'SecurityMonitor',
    channel: '#seguranca',
    username: 'Security Bot',
    iconEmoji: ':lock:'
  })
})
```
