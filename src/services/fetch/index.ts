import { ZodType, ZodError } from 'zod';

type FetchWrapperParams<T> = {
  input: URL | RequestInfo;
  init?: RequestInit;
  schemaValidator?: ZodType<T>;
};

export async function fetchWrapper<T>({
  input,
  init,
  schemaValidator,
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
}
