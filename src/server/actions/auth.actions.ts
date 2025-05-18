'use server';
import { redirect } from 'next/navigation';
import { createSession } from './session.actions';

import { SignInFormState, SignUpFormState } from 'src/types/forms';
import { routesBackend } from 'src/config/routes';
import { hrefs } from 'src/config/hrefs';
import { SignInFormSchema, SignUpFormSchema } from 'src/lib/validators/auth.validators';
import HTTP_STATUS from 'src/lib/constants/http-status-codes';
import { logError, logInfo } from 'src/server/logger';

const { signin, signup } = routesBackend.auth;
export async function signUp(
  _state: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const validationFields = SignUpFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    lastname: formData.get('lastname'),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(signup, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Nome: validationFields.data.name,
      Sobrenome: validationFields.data.lastname,
      Email: validationFields.data.email,
      Password: validationFields.data.password,
    }),
  });

  if (response.ok) {
    redirect(hrefs.auth.signIn);
  }
  return {
    status: response.status,
    message: response.statusText,
  };
}

export async function signIn(
  _state: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  let result: SignInFormState = {
    status: undefined,
    message: undefined,
  };
  logInfo('signIn', 'Iniciando processo de login');

  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    console.log('signIn: Validação de campos falhou', validatedFields.error.flatten().fieldErrors);
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('signIn: Campos validados, email:', validatedFields.data.email);
  console.log('signIn: Enviando requisição para API de login');

  try {
    const fetchStartTime = Date.now();
    const response = await fetch(signin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: validatedFields.data.email,
        Password: validatedFields.data.password,
      }),
    });
    const fetchEndTime = Date.now();

    console.log(
      `signIn: Resposta da API recebida em ${fetchEndTime - fetchStartTime}ms, status:`,
      response.status,
    );

    if (response.ok) {
      const { data }: { data: { id: string; accessToken: string; refreshToken: string } } =
        await response.json();
      console.log('signIn: Resposta da API recebida:', data);
      await createSession({
        id: data.id,
        access: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });

      if (response.ok) {
        redirect(hrefs.interface.index);
      }
    } else {
      console.log('signIn: Resposta da API não foi bem-sucedida:', response.statusText);
      result = {
        message: response.statusText || 'Falha na autenticação',
        status: response.status,
      };
    }
  } catch (error: unknown) {
    logError('signIn', error);

    result = {
      message: error instanceof Error ? error.message : 'Erro durante autenticação',
      status: HTTP_STATUS.UNAUTHORIZED.code,
    };
  }
  return result;
}

export const refreshToken = async (oldRefreshToken: string) => {
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
      throw new Error('Failed to refresh token' + response.statusText);
    }

    const { accessToken, refreshToken } = await response.json();
    // update session with new tokens
    const updateRes = await fetch(routesBackend.auth.refresh, {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
    if (!updateRes.ok) throw new Error('Failed to update the tokens');

    return accessToken;
  } catch (err) {
    logError('refreshToken', err);
    return {
      status: HTTP_STATUS.UNAUTHORIZED.code,
      message: 'Failed to refresh token',
    };
  }
};
