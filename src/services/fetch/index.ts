<<<<<<< HEAD
import { ZodType, ZodError } from 'zod';

type FetchWrapperParams<T> = {
  input: URL | RequestInfo;
  init?: RequestInit;
  schemaValidator?: ZodType<T>;
};
=======
import { ZodTypeAny } from "zod"
>>>>>>> 1ffae18ae098ae6c80604460cbe90bf8727433b0

export async function fetchWrapper<T>({
  input,
  init,
  schemaValidator,
<<<<<<< HEAD
}: FetchWrapperParams<T>): Promise<T> {
  const response = await fetch(typeof input === 'string' ? input : input.toString(), init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Erro na requisição');
  }

  if (schemaValidator) {
    try {
      return schemaValidator.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        // Você pode customizar o tratamento do erro aqui
        throw new Error('Erro de validação: ' + err.errors.map((e) => e.message).join(', '));
      }
      throw err;
    }
  }

  return data as T;
=======
}: {
  input: URL | RequestInfo
  init?: RequestInit | undefined
  schemaValidator?: ZodTypeAny
}): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${input}`,
        init
      )
      const result: T = await data.json()
      if (schemaValidator) {
        const zod = schemaValidator.parse(result)
        resolve(zod as T)
      }

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
>>>>>>> 1ffae18ae098ae6c80604460cbe90bf8727433b0
}
