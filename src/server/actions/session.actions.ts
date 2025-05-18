'use server';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import { Session, SessionToken } from 'src/types/auth';
import { Cookie_Keys } from 'src/lib/constants/cookies-keys';
import { AUTH_ERRORS } from 'src/lib/constants/error-messages';
import { routesBackend } from 'src/config/routes';
import { logError } from 'src/server/logger';
import HTTP_STATUS from 'src/lib/constants/http-status-codes';
import { InternalServerErrorException, UnauthorizedException } from 'src/lib/exceptions/exceptions';

// Tipos
interface JwtPayload {
  sub?: string;
  exp?: number;
  _iat?: number;
  [key: string]: any;
}

// Using error messages from constants

// Cache para sessões ativas
const sessionCache = new Map<string, { session: Session; expiresAt: number }>();

// Funções auxiliares

function validateTokenPayload(
  payload: JwtPayload,
): asserts payload is JwtPayload & { sub: string; exp: number } {
  if (!payload.sub || !payload.exp) {
    throw new Error(AUTH_ERRORS.INVALID_USER_ID);
  }
}

async function setAuthCookies(sessionToken: SessionToken, expiresIn: number) {
  const expiresDate = new Date(expiresIn * 1000);
  const cookiesStore = cookies();

  // Cookie HTTP Only para autenticação
  (await cookiesStore).set(Cookie_Keys.authToken, JSON.stringify(sessionToken), {
    expires: expiresDate,
    path: '/',
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // Cookie para acesso do cliente (sem dados sensíveis)
  const clientSession: Session = {
    id: sessionToken.id,
    access: { accessToken: sessionToken.access.accessToken },
  };

  (await cookiesStore).set(Cookie_Keys.token, JSON.stringify(clientSession), {
    expires: expiresDate,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function createSession(payload: SessionToken): Promise<Session | null> {
  try {
    const {
      access: { accessToken, refreshToken },
    } = payload;

    // Decodificar e validar o token de refresh
    const refreshPayload = decodeJwt(refreshToken) as JwtPayload;
    validateTokenPayload(refreshPayload);

    // Validar dados do usuário
    if (!refreshPayload || !('Email' in refreshPayload)) {
      throw new Error(AUTH_ERRORS.INVALID_USER_DATA);
    }

    // Criar token de sessão
    const sessionToken: SessionToken = {
      id: refreshPayload.sub!,
      access: { accessToken, refreshToken },
    };

    // Configurar cookies de autenticação
    await setAuthCookies(sessionToken, refreshPayload.exp);

    // Criar sessão para o cliente (sem dados sensíveis)
    const session: Session = {
      id: refreshPayload.sub!,
      access: { accessToken },
    };

    // Armazenar em cache
    const accessPayload = decodeJwt(accessToken) as JwtPayload;
    if (accessPayload.exp) {
      sessionCache.set(accessToken, {
        session,
        expiresAt: accessPayload.exp * 1000,
      });
    }

    return session;
  } catch (error) {
    logError('createSession', error, { hasToken: !!payload?.access?.accessToken });
    throw new InternalServerErrorException(InternalServerErrorException.SERVER_ERROR);
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookiesStore = await cookies();
    const cookie = cookiesStore.get(Cookie_Keys.token)?.value;

    if (!cookie) {
      return null;
    }

    // Verificar cache primeiro
    const cached = sessionCache.get(cookie);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.session;
    }

    // Se não estiver em cache ou expirado, validar o token
    const session = JSON.parse(cookie) as Session;

    try {
      const payload = decodeJwt(session.access.accessToken) as JwtPayload;

      // Verificar se o token expirou
      if (!payload.exp || payload.exp * 1000 < Date.now()) {
        throw new Error(AUTH_ERRORS.INVALID_SESSION);
      }

      // Armazenar em cache
      sessionCache.set(cookie, {
        session,
        expiresAt: payload.exp * 1000,
      });

      return session;
    } catch (error) {
      // Se o token estiver inválido, limpar os cookies
      if (error instanceof Error) {
        logError('getSession', error, { reason: 'Token inválido' });
      }
      await deleteSession();
      return null;
    }
  } catch (error) {
    logError('getSession', error);
    return null;
  }
}

export async function getSessionToken(): Promise<SessionToken | null> {
  try {
    const cookiesStore = await cookies();
    const cookie = cookiesStore.get(Cookie_Keys.authToken)?.value;

    if (!cookie) {
      return null;
    }

    const sessionToken = JSON.parse(cookie) as SessionToken;

    try {
      // Verificar se o token de refresh ainda é válido
      const refreshPayload = decodeJwt(sessionToken.access.refreshToken) as JwtPayload;

      if (!refreshPayload.exp || refreshPayload.exp * 1000 < Date.now()) {
        throw new Error(AUTH_ERRORS.INVALID_SESSION);
      }

      return sessionToken;
    } catch (error) {
      logError('getSessionToken', error, { reason: 'Token de refresh inválido' });
      await deleteSession();
      return null;
    }
  } catch (error) {
    logError('getSessionToken', error);
    return null;
  }
}

export async function deleteSession() {
  try {
    const cookiesStore = await cookies();
    const sessionCookie = cookiesStore.get(Cookie_Keys.token)?.value;

    // Limpar cookies
    cookiesStore.delete(Cookie_Keys.token);
    cookiesStore.delete(Cookie_Keys.authToken);

    // Limpar do cache se existir
    if (sessionCookie) {
      sessionCache.delete(sessionCookie);
    }

    return {
      status: HTTP_STATUS.OK.code,
      message: 'Sessão removida com sucesso',
    };
  } catch (error) {
    logError('deleteSession', error);
    throw error;
  }
}

export async function updateSession(updates: Partial<Session>): Promise<Session | null> {
  try {
    const currentSession = await getSessionToken();

    if (!currentSession) {
      throw new UnauthorizedException(UnauthorizedException.SESSION_EXPIRED);
    }

    // Atualizar apenas os campos fornecidos
    const updatedSession: SessionToken = {
      ...currentSession,
      access: {
        ...currentSession.access,
        ...updates.access,
      },
    };

    // Decodificar o token de refresh para obter a expiração
    const refreshPayload = decodeJwt(currentSession.access.refreshToken) as JwtPayload;
    validateTokenPayload(refreshPayload);

    // Atualizar cookies
    await setAuthCookies(updatedSession, refreshPayload.exp);

    // Retornar apenas os dados não sensíveis
    return {
      id: updatedSession.id,
      access: { accessToken: updatedSession.access.accessToken },
    };
  } catch (error) {
    logError('updateSession', error);
    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }
}

export async function updateToken(oldRefreshToken: string): Promise<Session | null> {
  try {
    const response = await fetch(routesBackend.auth.refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Falha ao atualizar token: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const { accessToken, refreshToken } = await response.json();

    // Validar o novo token de acesso
    const accessPayload = decodeJwt(accessToken) as JwtPayload;
    if (!accessPayload.sub) {
      throw new Error(AUTH_ERRORS.INVALID_USER_ID);
    }

    // Criar nova sessão com os tokens atualizados
    const sessionToken: SessionToken = {
      id: accessPayload.sub,
      access: { accessToken, refreshToken },
    };

    // Decodificar o novo token de refresh para obter a expiração
    const refreshPayload = decodeJwt(refreshToken) as JwtPayload;
    validateTokenPayload(refreshPayload);

    // Atualizar cookies
    await setAuthCookies(sessionToken, refreshPayload.exp);

    // Limpar cache antigo
    const cookiesStore = await cookies();
    const oldSessionCookie = cookiesStore.get(Cookie_Keys.token)?.value;
    if (oldSessionCookie) {
      sessionCache.delete(oldSessionCookie);
    }

    return {
      id: accessPayload.sub,
      access: { accessToken },
    };
  } catch (error) {
    logError('updateToken', error, { hasRefreshToken: !!oldRefreshToken });

    // Se houver erro ao atualizar o token, forçar logout
    if (error instanceof Error && error.message.includes('401')) {
      await deleteSession();
    }

    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }
}
