import HTTP_STATUS from '../constants/http-status-codes';

/**
 * Exceção para erros não tratados ou desconhecidos.
 * Captura stack, causa/original, mensagem e permite rastreio detalhado para logs.
 */
export class UnhandledException extends Error {
  public readonly status: number;
  public readonly originalError?: unknown;
  public readonly stackTrace?: string;
  public readonly cause?: unknown;

  constructor(error: unknown, customMessage?: string) {
    const message = customMessage || (error instanceof Error ? error.message : String(error));
    super(message);
    this.status = HTTP_STATUS.INTERNAL_SERVER_ERROR?.code || 500;
    this.name = 'UnhandledException';
    this.originalError = error;
    this.stackTrace = error instanceof Error ? error.stack : undefined;
    // Suporte opcional para error.cause
    if (error && typeof error === 'object' && 'cause' in error) {
      this.cause = (error as any).cause;
    }
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly description?: string;

  constructor(status: number, message: string, description?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.description = description;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class BadRequestException extends HttpException {
  static readonly DEFAULT = {
    message: 'Bad Request',
    description: 'A requisição contém dados inválidos.',
  };

  constructor({
    message = HTTP_STATUS.BAD_REQUEST.constant,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.BAD_REQUEST.code, message, description);
  }
}

export class UnauthorizedException extends HttpException {
  static readonly SESSION_EXPIRED = {
    message: 'Sessão expirada',
    description: 'Por favor, faça login novamente.',
  };
  static readonly INVALID_TOKEN = {
    message: 'Token inválido',
    description: 'O token fornecido é inválido ou expirou.',
  };
  static readonly USER_WITHOUT_PERMISSOES = {
    message: 'Não possui permissões',
    description: 'Usuario sem permissões',
  };

  constructor({
    message = HTTP_STATUS.UNAUTHORIZED.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.UNAUTHORIZED.code, message, description);
  }
}

export class ForbiddenException extends HttpException {
  static readonly ACCESS_DENIED = {
    message: 'Acesso negado',
    description: 'Você não tem permissão para acessar este recurso.',
  };

  constructor({
    message = HTTP_STATUS.FORBIDDEN.constant,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.FORBIDDEN.code, message, description);
  }
}

export class NotFoundException extends HttpException {
  static readonly COMPANY_NOT_FOUND = {
    message: 'Nenhuma empresa encontrada',
    description: 'Você não possui acesso a nenhuma empresa.',
  };

  static readonly RESOURCE_NOT_FOUND = {
    message: 'Recurso não encontrado',
    description: 'O recurso solicitado não existe.',
  };

  static readonly SESSION_NOT_FOUND = {
    message: 'Sessão não encontrada',
    description: 'Sua sessão expirou ou não está mais ativa.',
  };

  constructor({
    message = HTTP_STATUS.NOT_FOUND.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.NOT_FOUND.code, message, description);
  }
}

export class InternalServerErrorException extends HttpException {
  static readonly SERVER_ERROR = {
    message: 'Erro interno',
    description: 'Ocorreu um erro no servidor.',
  };

  constructor({
    message = HTTP_STATUS.INTERNAL_SERVER_ERROR.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR.code, message, description);
  }
}

export class ConflictException extends HttpException {
  static readonly RESOURCE_CONFLICT = {
    message: 'Conflito',
    description: 'O recurso já existe ou está em conflito.',
  };

  constructor({
    message = HTTP_STATUS.CONFLICT.constant,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.CONFLICT.code, message, description);
  }
}

export class TooManyRequestsException extends HttpException {
  static readonly RATE_LIMIT = {
    message: 'Muitas requisições',
    description: 'Por favor, aguarde um momento antes de tentar novamente.',
  };

  constructor({
    message = HTTP_STATUS.TOO_MANY_REQUESTS.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.TOO_MANY_REQUESTS.code, message, description);
  }
}

export class GatewayTimeoutException extends HttpException {
  static readonly TIMEOUT = {
    message: 'Tempo limite excedido',
    description: 'O servidor demorou muito para responder.',
  };

  constructor({
    message = HTTP_STATUS.GATEWAY_TIMEOUT.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.GATEWAY_TIMEOUT.code, message, description);
  }
}

export class ServiceUnavailableException extends HttpException {
  static readonly SERVICE_DOWN = {
    message: 'Serviço indisponível',
    description: 'O serviço está temporariamente indisponível.',
  };

  constructor({
    message = HTTP_STATUS.SERVICE_UNAVAILABLE.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.SERVICE_UNAVAILABLE.code, message, description);
  }
}

export class BadGatewayException extends HttpException {
  static readonly BAD_GATEWAY = {
    message: 'Gateway inválido',
    description: 'Erro ao se comunicar com o servidor.',
  };

  constructor({
    message = HTTP_STATUS.BAD_GATEWAY.constant,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.BAD_GATEWAY.code, message, description);
  }
}

export class NetworkAuthenticationRequiredException extends HttpException {
  static readonly AUTH_REQUIRED = {
    message: 'Autenticação de rede necessária',
    description: 'É necessário autenticar-se na rede.',
  };

  constructor({
    message = HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED.code, message, description);
  }
}

export class PayloadTooLargeException extends HttpException {
  static readonly LARGE_PAYLOAD = {
    message: 'Payload muito grande',
    description: 'Os dados enviados são muito grandes.',
  };

  constructor({
    message = HTTP_STATUS.CONTENT_TOO_LARGE.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.CONTENT_TOO_LARGE.code, message, description);
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  static readonly UNSUPPORTED_TYPE = {
    message: 'Tipo de mídia não suportado',
    description: 'O formato do arquivo não é suportado.',
  };

  constructor({
    message = HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE.reasonPhrase,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE.code, message, description);
  }
}
