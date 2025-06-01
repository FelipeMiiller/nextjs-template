import { NextResponse } from 'next/server';

import { getSession, updateSession } from 'src/actions/session.actions';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Session not found' });
  }
  const result = await updateSession(session);
  return NextResponse.json({ success: true, result });
}
