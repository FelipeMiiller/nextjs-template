/**
 * Error messages used throughout the application
 */

export const AUTH_ERRORS = {
  // Session related errors
  INVALID_SESSION: 'Sessão inválida ou expirada',
  SESSION_ERROR: 'Erro ao processar a sessão',
  TOKEN_REFRESH_FAILED: 'Falha ao atualizar o token',

  // Token related errors
  INVALID_ACCESS_TOKEN: 'Token de acesso inválido',
  INVALID_REFRESH_TOKEN: 'Token de atualização inválido',
  TOKEN_EXPIRED: 'Token expirado',

  // User related errors
  INVALID_USER_ID: 'ID do usuário inválido no token',
  INVALID_USER_DATA: 'Dados de usuário inválidos no token',
  USER_NOT_FOUND: 'Usuário não encontrado',

  // Authentication errors
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',

  // Validation errors
  VALIDATION_ERROR: 'Erro de validação',
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'E-mail inválido',
  WEAK_PASSWORD: 'Senha muito fraca',

  // Rate limiting
  TOO_MANY_REQUESTS: 'Muitas requisições. Por favor, tente novamente mais tarde.',
} as const;

export const DATABASE_ERRORS = {
  CONNECTION_ERROR: 'Erro ao conectar ao banco de dados',
  QUERY_ERROR: 'Erro ao executar consulta',
  RECORD_NOT_FOUND: 'Registro não encontrado',
  DUPLICATE_ENTRY: 'Registro duplicado',
  CONSTRAINT_VIOLATION: 'Violação de restrição',
} as const;

export const VALIDATION_ERRORS = {
  INVALID_INPUT: 'Entrada inválida',
  INVALID_EMAIL: 'Formato de e-mail inválido',
  PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 8 caracteres',
  PASSWORD_MISMATCH: 'As senhas não coincidem',
  REQUIRED_FIELD: 'Este campo é obrigatório',
} as const;

export const API_ERRORS = {
  BAD_REQUEST: 'Requisição inválida',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Recurso não encontrado',
  INTERNAL_SERVER_ERROR: 'Erro interno do servidor',
  SERVICE_UNAVAILABLE: 'Serviço indisponível',
  TIMEOUT: 'Tempo limite da requisição excedido',
} as const;

// Export all error messages as a single object
export const ERROR_MESSAGES = {
  ...AUTH_ERRORS,
  ...DATABASE_ERRORS,
  ...VALIDATION_ERRORS,
  ...API_ERRORS,
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
