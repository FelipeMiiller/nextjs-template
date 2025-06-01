'use server';
import { Session } from 'src/types/auth';
import { base64url, decodeJwt, EncryptJWT, jwtDecrypt } from 'jose';
import { cookies } from 'next/headers';
import { Cookie_Keys } from 'src/lib/constants/cookies-keys';
import { routesBackend } from 'src/config/routes';
import { UnauthorizedException } from 'src/lib/exceptions/exceptions';

export async function createSession({ accessToken, refreshToken }: Session): Promise<void> {
  await setTokenCookie({ token: accessToken, key: Cookie_Keys.token });
  await setTokenCookie({ token: refreshToken, key: Cookie_Keys.refreshToken });
}

export async function deleteSession() {
  try {
    const cookiesStore = await cookies();
    await fetch(routesBackend.auth.signout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${await getTokenCookie(Cookie_Keys.token)}`,
      },
    });
    // Limpar cookies
    cookiesStore.delete(Cookie_Keys.token);
    cookiesStore.delete(Cookie_Keys.refreshToken);
  } catch {}
}

export async function getSession(): Promise<Session> {
  const accessToken = await getTokenCookie(Cookie_Keys.token);
  const refreshToken = await getTokenCookie(Cookie_Keys.refreshToken);
  return { accessToken, refreshToken };
}

export const refreshToken = async (oldRefreshToken: string): Promise<string> => {
  try {
    const response = await fetch(routesBackend.auth.refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = errorData.message
        ? { message: errorData.message as string }
        : UnauthorizedException.INVALID_TOKEN;
      throw new UnauthorizedException(error);
    }

    const { accessToken } = await response.json();

    await setTokenCookie({ token: accessToken, key: Cookie_Keys.token });
    return accessToken;
  } catch {
    await deleteSession();

    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }
};

export async function setTokenCookie({ token, key }: { token: string; key: string }) {
  if (!token || !key) {
    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }

  const Payload = decodeJwt(token);
  if (!Payload.exp) {
    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }
  const expiresDate = new Date(Payload.exp * 1000);

  const encryptedToken = await encryptToken(token, Payload.exp);

  (await cookies()).set(key, encryptedToken, {
    expires: expiresDate,
    path: '/',
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getTokenCookie(key: string): Promise<string> {
  const cookiesStore = await cookies();

  const encryptedToken = cookiesStore.get(key)?.value;

  if (!encryptedToken) {
    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }
  const decryptedToken = await decryptToken(encryptedToken);

  return decryptedToken;
}

/**
 * Processa a chave de criptografia para garantir que tenha 32 bytes
 */
function getSecretKey(): Uint8Array {
  const rawKey = process.env.ENCRYPTION_KEY ?? 'chave-forte-32-bytes-encryption-key';
  // Verifica se é uma string base64url válida de 43 caracteres
  if (rawKey.length === 43 && /^[A-Za-z0-9_-]+$/.test(rawKey)) {
    return base64url.decode(rawKey);
  }
  // Caso contrário, usa como texto e garante 32 bytes
  return new TextEncoder().encode(rawKey.slice(0, 32).padEnd(32, '0'));
}

async function decryptToken(token: string): Promise<string> {
  const secretKey = getSecretKey();
  const decryptedToken = await jwtDecrypt(token, secretKey);

  if (!decryptedToken.payload.token) {
    throw new UnauthorizedException(UnauthorizedException.INVALID_TOKEN);
  }

  return decryptedToken.payload.token as string;
}

async function encryptToken(token: string, exp: number): Promise<string> {
  const secretKey = getSecretKey();

  return await new EncryptJWT({ token })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setExpirationTime(exp)
    .encrypt(secretKey);
}
