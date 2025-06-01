import { NextRequest, NextResponse } from 'next/server';
import { SlackEdgeNotificationProvider } from '@/server/slack/slack-edge';
import { getTokenCookie } from '@/server/actions/session.actions';
import { Cookie_Keys } from '@/lib/constants/cookies-keys';

// Define que esta rota usa o runtime Edge
export const runtime = 'edge';

/**
 * API para enviar notificações para o Slack a partir do cliente
 * Endpoint: POST /api/slack/notify
 */
export async function POST(req: NextRequest) {
  try {
    const sessionToken = getTokenCookie(Cookie_Keys.token);
    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token not found' }, { status: 401 });
    }

    // Valida o corpo da requisição
    const body = await req.json();
    const {
      message,
      level = 'info',
      context,
      metadata,
      channel,
      username,
      iconEmoji,
      timeoutMs,
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'The "message" field is required and must be a string.' },
        { status: 400 },
      );
    }

    // Verifica se o webhook está configurado
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('SLACK_WEBHOOK_URL not configured. Notification not sent.');
      return NextResponse.json({ ok: false, warning: 'Slack not configured' });
    }

    const slack = new SlackEdgeNotificationProvider({
      webhookUrl,
      channel: channel || process.env.SLACK_CHANNEL,
      username: username || process.env.SLACK_USERNAME,
      iconEmoji: iconEmoji || process.env.SLACK_ICON_EMOJI,
      environment: process.env.NODE_ENV,
      timeoutMs: timeoutMs || undefined,
    });

    // Envia a notificação
    await slack.notify({
      message,
      level: level as string,
      context,
      metadata,
      timestamp: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro na API Slack Notify:', error);
    return NextResponse.json({ error: 'Falha ao enviar mensagem ao Slack.' }, { status: 500 });
  }
}
