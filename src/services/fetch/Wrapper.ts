import { envPublic } from '@/config/env.public';
import { ZodTypeAny } from 'zod';

export async function fetchWrapper<T>({
  input,
  init,
  schemaValidator,
}: {
  input: URL | RequestInfo;
  init?: RequestInit | undefined;
  schemaValidator?: ZodTypeAny;
}): Promise<T> {
  const routeKey = typeof input === 'string' ? input : input instanceof URL ? input.pathname : '';

  const tags = [routeKey.replace(/\W+/g, '_')]; // Remove caracteres especiais e espaços
  const revalidate =
    typeof init?.next?.revalidate === 'number' ? init.next.revalidate : envPublic.revalidateSeconds;

  const customNext: Required<NextFetchRequestConfig> = {
    revalidate,
    tags,
  };

  const fetchInit: RequestInit & { next?: NextFetchRequestConfig } = {
    ...init,
    next: customNext,
  };

  const data = await fetch(input, fetchInit);
  const result: T = await data.json();
  if (schemaValidator) {
    return schemaValidator.parse(result) as T;
  }
  return result;
}
