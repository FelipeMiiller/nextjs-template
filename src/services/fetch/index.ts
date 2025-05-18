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
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fake?route=${input}`, init);
      const result: T = await data.json();
      if (schemaValidator) {
        const zod = schemaValidator.parse(result);
        resolve(zod as T);
      }

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
