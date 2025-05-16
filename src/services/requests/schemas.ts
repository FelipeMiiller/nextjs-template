// Exemplo de uso com schema (defina seus schemas conforme sua tipagem real)
import { Role } from 'src/types/auth';
import { z } from 'zod';
export const UserSchema = z.object({
  Email: z.string(),
  Id: z.string(),
  Role: z.nativeEnum(Role),
});
