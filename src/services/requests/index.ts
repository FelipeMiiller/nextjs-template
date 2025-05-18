import { routesBackend } from 'src/config/routes';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { toast } from 'sonner';
import { hrefs } from 'src/config/hrefs';
import { Cookie_Keys } from 'src/lib/constants/cookies-keys';
import { Session, User } from 'src/types/auth';
import { ZodType, ZodError, z } from 'zod';
import { UserSchema } from './schemas';
import { CookieManager } from 'src/lib/utils/cookie-manager';

const axiosInstance: AxiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Adiciona token automaticamente às requests
axiosInstance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config; // SSR safety
  try {
    const sessionCookie = CookieManager.get<Session>(Cookie_Keys.token);
    if (sessionCookie?.access?.accessToken) {
      config.headers.Authorization = `Bearer ${sessionCookie.access.accessToken}`;
    }
  } catch (e) {
    console.error('Cookie de sessão inválido:', e);
    if (typeof window !== 'undefined') window.location.href = hrefs.auth.signIn;
  }
  return config;
});

// Centraliza tratamento de erros
function handleApiError(error: AxiosError) {
  const status = error.response?.status;
  if (typeof window !== 'undefined') {
    switch (status) {
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
        toast('Erro', { description: 'Ocorreu um erro. Tente novamente mais tarde.' });
    }
  }
  return Promise.reject(error);
}

axiosInstance.interceptors.response.use((response: AxiosResponse) => response, handleApiError);

// Função genérica para requests com validação opcional Zod
async function apiRequest<T>(config: AxiosRequestConfig, schema?: ZodType<T>): Promise<T> {
  try {
    const response = await axiosInstance(config);
    const data = response.data.data;

    if (schema) {
      try {
        return schema.parse(data);
      } catch (err) {
        if (err instanceof ZodError) {
          toast('Erro de validação', {
            description: 'Erro de validação: informe a equipe responsável',
          });
          console.log('Erro de validação: ' + err.errors.map((e) => e.message).join(', '));
        }
        toast('Erro de validação', {
          description: 'Erro de validação: informe a equipe responsável',
        });
        console.log('Erro de validação: ' + err);
      }
    }

    return data as T;
  } catch (error) {
    throw error;
  }
}

export const GetMe = () =>
  apiRequest<User>({ method: 'get', url: routesBackend.auth.me, timeout: 1000 * 350 }, UserSchema);
export const GetUsers = () =>
  apiRequest<User[]>(
    { method: 'get', url: routesBackend.users.getAll, timeout: 1000 * 350 },
    z.array(UserSchema),
  );
export const PostUser = (user: User) =>
  apiRequest<User>(
    { method: 'post', url: routesBackend.users.create, timeout: 1000 * 350, data: user },
    UserSchema,
  );

export default axiosInstance;
