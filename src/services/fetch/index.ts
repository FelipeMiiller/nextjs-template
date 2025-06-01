import { routesBackend } from 'src/config/routes';
import { User } from 'src/types/auth';
import { ZodTypeAny, z } from 'zod';
import { UserSchema } from '../requests/schemas';
import { toast } from 'sonner';
import { hrefs } from 'src/config/hrefs';
import { fetchWrapper } from './Wrapper';
import { revalidateTag } from 'next/cache';

/**
 * Wrapper para fetch com tratamento centralizado de erros e validação opcional via Zod.
 * Sempre lança o erro após tratar (não faz throw/reject duplo).
 */

import { CACHE_TAGS } from './cache-keys';

export async function fetchClient<T>(args: {
  input: URL | RequestInfo;
  init?: RequestInit;
  schemaValidator?: ZodTypeAny;
}): Promise<T> {
  // Adiciona token JWT do cookie ao header Authorization, se existir
  const headers = new Headers(args.init?.headers || {});
  try {
    // const token = CookieManager.get<string>(Cookie_Keys.token);
    // if (token) {
    //  headers.set('Authorization', `Bearer ${token}`);
    // }
  } catch {}
  const initWithAuth: RequestInit = { ...args.init, headers };
  return fetchWrapper<T>({ ...args, init: initWithAuth }).catch((error) => {
    if (typeof window !== 'undefined') {
      if (error instanceof Response) {
        switch (error.status) {
          case 401:
            window.location.href = hrefs.auth.signIn;
            break;
          case 403:
            toast('Acesso Negado', {
              description: 'Você não tem permissão para acessar este recurso.',
            });
            break;
          case 404:
            toast('Não Encontrado', { description: 'O recurso solicitado não foi encontrado.' });
            break;
          case 500:
            toast('Erro do Servidor', {
              description: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
            });
            break;
          default:
            throw error;
        }
      }
    }
    throw error;
  });
}

// Exemplo de uso: buscar usuário logado
export const GetMe = () =>
  fetchClient<User>({
    input: routesBackend.auth.me,
    init: { method: 'GET' },
    schemaValidator: UserSchema,
  });

// Exemplo de uso: buscar todos usuários
export const GetUsers = () =>
  fetchClient<User[]>({
    input: routesBackend.users.getAll,
    init: { method: 'GET', next: { tags: [CACHE_TAGS.USERS] } },
    schemaValidator: z.array(UserSchema),
  });

// Exemplo de uso: criar usuário
export const PostUser = async (user: User) => {
  const created = await fetchClient<User>({
    input: routesBackend.users.create,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    },
    schemaValidator: UserSchema,
  });
  revalidateTag(CACHE_TAGS.USERS);
  return created;
};
