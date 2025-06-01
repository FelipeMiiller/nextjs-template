import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n } from './services/i18n/i18n-config';
import { deleteSession, getSession, refreshToken } from './server/actions/session.actions';
import { hrefs } from './config/hrefs';

// Lista de extensões de arquivo estático para ignorar
const staticExtensions = [
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.css',
  '.js',
  '.json',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
];

function isStaticPath(pathname: string): boolean {
  // Verifica se o caminho começa com _next, api ou termina com uma extensão estática
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    staticExtensions.some((ext) => pathname.endsWith(ext))
  );
}

function getLocale(request: NextRequest): string | undefined {
  const pathname = request.nextUrl.pathname;

  // Pular para arquivos estáticos e rotas de API
  if (isStaticPath(pathname)) {
    return undefined;
  }

  // Handle locale detection
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  const defaultLocale = i18n.defaultLocale;

  try {
    return matchLocale(languages, i18n.locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pular arquivos estáticos e rotas de API
  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale: string) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url),
    );
  }
  try {
    if (pathname.includes(hrefs.interface.index)) {
      const session = await getSession();
      console.log(session);
      if (!session?.refreshToken) {
        await deleteSession();
        return NextResponse.redirect(new URL(hrefs.auth.signIn, request.nextUrl.origin));
      }
      if (!session?.accessToken) {
        const accessToken = await refreshToken(session.refreshToken);
        if (!accessToken) {
          await deleteSession();
          return NextResponse.redirect(new URL(hrefs.auth.signIn, request.nextUrl.origin));
        }
      }
    }
  } catch (error) {
    console.log('Error', error);
    return NextResponse.redirect(new URL(hrefs.home, request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
