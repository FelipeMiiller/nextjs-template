import { hrefs } from '@/config/hrefs';
import { deleteSession } from '@/server/actions/session.actions';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST() {
  // Realiza o signout utilizando a lógica centralizada
  await deleteSession();
  // A função deleteSession já faz o redirect, mas retornamos um JSON para compatibilidade
  redirect(hrefs.home);
}
