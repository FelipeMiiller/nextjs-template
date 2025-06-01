import HTTP_STATUS from '../constants/http-status-codes';

export class HttpException extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly description?: string;
  public readonly originalError?: unknown;
  public readonly stackTrace?: string;
  public readonly cause?: unknown;
  public readonly name: string;
  public readonly timestamp: string;
  public readonly path?: string;
  public readonly method?: string;
  public readonly code?: string | number;

  /**
   * @param status Código HTTP (ex: 400, 401, 500)
   * @param customMessage Mensagem customizada para resposta
   * @param description Descrição detalhada do erro (opcional)
   * @param error Objeto de erro original (opcional)
   * @param extras Campos extras como path, method, code (opcional)
   */
  constructor(
    status: number,
    error?: unknown,
    customMessage?: string,
    description?: string,
    extras?: { path?: string; method?: string; code?: string | number },
  ) {
    const message =
      customMessage ||
      (error instanceof Error ? error.message : error ? String(error) : 'Internal Server Error');
    super(message);

    this.status = status;
    this.message = message;
    this.description = description;
    this.originalError = error;
    this.stackTrace = error instanceof Error ? error.stack : undefined;
    this.cause =
      error && typeof error === 'object' && 'cause' in error ? (error as any).cause : undefined;
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();

    if (extras) {
      this.path = extras.path;
      this.method = extras.method;
      this.code = extras.code;
    }

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
      description: this.description,
      code: this.code,
      path: this.path,
      method: this.method,
      timestamp: this.timestamp,
      stackTrace: this.stackTrace,
      cause: this.cause,
      originalError:
        this.originalError instanceof Error
          ? { message: this.originalError.message, stack: this.originalError.stack }
          : this.originalError,
    };
  }
}
export class BadRequestException extends HttpException {
  static readonly DEFAULT = {
    error: undefined,
    message: 'Bad Request',
    description: 'A requisição contém dados inválidos.',
  };

  constructor({
    error,
    message = HTTP_STATUS.BAD_REQUEST.messages.BAD_REQUEST,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.BAD_REQUEST.code, error, message, description, extras);
  }
}

export class UnauthorizedException extends HttpException {
  static readonly SESSION_EXPIRED = {
    message: 'Session expired',
    description: 'Please login again.',
  };
  static readonly INVALID_TOKEN = {
    message: 'Invalid token',
    description: 'The provided token is invalid or expired.',
  };
  static readonly USER_WITHOUT_PERMISSOES = {
    message: 'User without permissions',
    description: 'User without permissions',
  };

  constructor({
    error,
    message = HTTP_STATUS.UNAUTHORIZED.messages.UNAUTHORIZED,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.UNAUTHORIZED.code, error, message, description, extras);
  }
}

export class ForbiddenException extends HttpException {
  static readonly ACCESS_DENIED = {
    message: 'Access denied',
    description: 'You do not have permission to access this resource.',
  };

  constructor({
    error,
    message = HTTP_STATUS.FORBIDDEN.messages.FORBIDDEN,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.FORBIDDEN.code, error, message, description, extras);
  }
}

export class NotFoundException extends HttpException {
  static readonly COMPANY_NOT_FOUND = {
    message: 'No company found',
    description: 'You do not have access to any company.',
  };

  static readonly RESOURCE_NOT_FOUND = {
    message: 'Resource not found',
    description: 'The requested resource does not exist.',
  };

  static readonly SESSION_NOT_FOUND = {
    message: 'Session not found',
    description: 'Your session has expired or is no longer active.',
  };

  constructor({
    error,
    message = HTTP_STATUS.NOT_FOUND.messages.NOT_FOUND,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.NOT_FOUND.code, error, message, description, extras);
  }
}

export class InternalServerErrorException extends HttpException {
  static readonly SERVER_ERROR = {
    message: 'Internal error',
    description: 'An error occurred on the server.',
  };

  constructor({
    error,
    message = HTTP_STATUS.INTERNAL_SERVER_ERROR.messages.INTERNAL_SERVER_ERROR,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR.code, error, message, description, extras);
  }
}

export class ConflictException extends HttpException {
  static readonly RESOURCE_CONFLICT = {
    message: 'Conflict',
    description: 'The resource already exists or is in conflict.',
  };

  constructor({
    error,
    message = HTTP_STATUS.CONFLICT.messages.CONFLICT,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.CONFLICT.code, error, message, description, extras);
  }
}

export class TooManyRequestsException extends HttpException {
  static readonly RATE_LIMIT = {
    message: 'Too many requests',
    description: 'Please wait a moment before trying again.',
  };

  constructor({
    error,
    message = HTTP_STATUS.TOO_MANY_REQUESTS.messages.TOO_MANY_REQUESTS,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.TOO_MANY_REQUESTS.code, error, message, description, extras);
  }
}

export class GatewayTimeoutException extends HttpException {
  static readonly TIMEOUT = {
    message: 'Timeout exceeded',
    description: 'The server took too long to respond.',
  };

  constructor({
    error,
    message = HTTP_STATUS.GATEWAY_TIMEOUT.messages.GATEWAY_TIMEOUT,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.GATEWAY_TIMEOUT.code, error, message, description, extras);
  }
}

export class ServiceUnavailableException extends HttpException {
  static readonly SERVICE_DOWN = {
    message: 'Service unavailable',
    description: 'The service is temporarily unavailable.',
  };

  constructor({
    error,
    message = HTTP_STATUS.SERVICE_UNAVAILABLE.messages.SERVICE_UNAVAILABLE,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.SERVICE_UNAVAILABLE.code, error, message, description, extras);
  }
}

export class BadGatewayException extends HttpException {
  static readonly BAD_GATEWAY = {
    message: 'Bad gateway',
    description: 'Error communicating with the server.',
  };

  constructor({
    error,
    message = HTTP_STATUS.BAD_GATEWAY.messages.BAD_GATEWAY,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.BAD_GATEWAY.code, error, message, description, extras);
  }
}

export class NetworkAuthenticationRequiredException extends HttpException {
  static readonly AUTH_REQUIRED = {
    message: 'Network authentication required',
    description: 'You must authenticate on the network.',
  };

  constructor({
    error,
    message = HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED.messages.NETWORK_AUTHENTICATION_REQUIRED,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED.code, error, message, description, extras);
  }
}

export class PayloadTooLargeException extends HttpException {
  static readonly LARGE_PAYLOAD = {
    message: 'Payload too large',
    description: 'The data sent is too large.',
  };

  constructor({
    error,
    message = HTTP_STATUS.CONTENT_TOO_LARGE.messages.CONTENT_TOO_LARGE,
    description,
    extras,
  }: {
    error?: unknown;
    message?: string;
    description?: string;
    extras?: { path?: string; method?: string; code?: string | number };
  }) {
    super(HTTP_STATUS.CONTENT_TOO_LARGE.code, error, message, description, extras);
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  static readonly UNSUPPORTED_TYPE = {
    message: 'Unsupported media type',
    description: 'The file format is not supported.',
  };

  constructor({
    message = HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE.messages.UNSUPPORTED_MEDIA_TYPE,
    description,
  }: {
    message?: string;
    description?: string;
  }) {
    super(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE.code, message, description);
  }
}
