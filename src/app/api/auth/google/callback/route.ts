import { NextRequest, NextResponse } from 'next/server';
import { createSession } from 'src/server/actions/session.actions';
import { hrefs } from 'src/config/hrefs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Google OAuth Failed!' }, { status: 400 });
  }

  await createSession({ accessToken, refreshToken });

  return NextResponse.redirect(new URL(hrefs.interface.index, req.nextUrl.origin));
}
