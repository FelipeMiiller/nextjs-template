const HttpStatus = {
  // 1xx Informational
  CONTINUE: {
    code: 100,
    messages: {
      CONTINUE: 'Continue',
    },
  },
  SWITCHING_PROTOCOLS: {
    code: 101,
    messages: {
      SWITCHING_PROTOCOLS: 'Switching protocols',
    },
  },
  PROCESSING: {
    code: 102,
    messages: {
      PROCESSING: 'Processing',
    },
  },
  EARLY_HINTS: {
    code: 103,
    messages: {
      EARLY_HINTS: 'Early hints',
    },
  },

  // 2xx Success
  OK: {
    code: 200,
    constant: 'OK',
    reasonPhrase: 'OK',
  },
  CREATED: {
    code: 201,
    messages: {
      CREATED: 'Created',
    },
  },
  ACCEPTED: {
    code: 202,
    messages: {
      ACCEPTED: 'Accepted',
    },
  },
  NON_AUTHORITATIVE_INFORMATION: {
    code: 203,
    messages: {
      NON_AUTHORITATIVE_INFORMATION: 'Non authoritative information',
    },
  },
  NO_CONTENT: {
    code: 204,
    messages: {
      NO_CONTENT: 'No content',
    },
  },
  RESET_CONTENT: {
    code: 205,
    messages: {
      RESET_CONTENT: 'Reset content',
    },
  },
  PARTIAL_CONTENT: {
    code: 206,
    messages: {
      PARTIAL_CONTENT: 'Partial content',
    },
  },
  MULTI_STATUS: {
    code: 207,
    messages: {
      MULTI_STATUS: 'Multi-status',
    },
  },

  // 3xx Redirection
  MULTIPLE_CHOICES: {
    code: 300,
    messages: {
      MULTIPLE_CHOICES: 'Multiple choices',
    },
  },
  MOVED_PERMANENTLY: {
    code: 301,
    messages: {
      MOVED_PERMANENTLY: 'Moved permanently',
    },
  },
  MOVED_TEMPORARILY: {
    code: 302,
    messages: {
      MOVED_TEMPORARILY: 'Moved temporarily',
    },
  },
  SEE_OTHER: {
    code: 303,
    messages: {
      SEE_OTHER: 'See other',
    },
  },
  NOT_MODIFIED: {
    code: 304,
    messages: {
      NOT_MODIFIED: 'Not modified',
    },
  },
  USE_PROXY: {
    code: 305,
    messages: {
      USE_PROXY: 'Use proxy',
    },
  },
  TEMPORARY_REDIRECT: {
    code: 307,
    messages: {
      TEMPORARY_REDIRECT: 'Temporary redirect',
    },
  },
  PERMANENT_REDIRECT: {
    code: 308,
    messages: {
      PERMANENT_REDIRECT: 'Permanent redirect',
    },
  },

  // 4xx Client Error
  BAD_REQUEST: {
    code: 400,

    messages: {
      BAD_REQUEST: 'Invalid request',
      VALIDATION_ERROR: 'Validation error',
      INVALID_INPUT: 'Invalid input',
      REQUIRED_FIELD: 'This field is required',
      INVALID_EMAIL: 'Invalid email format',
      PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
      PASSWORD_MISMATCH: 'Passwords do not match',
    },
  },
  UNAUTHORIZED: {
    code: 401,

    messages: {
      UNAUTHORIZED: 'Unauthorized',
      INVALID_SESSION: 'Invalid or expired session',
      INVALID_ACCESS_TOKEN: 'Invalid access token',
      INVALID_REFRESH_TOKEN: 'Invalid refresh token',
      TOKEN_EXPIRED: 'Token expired',
      TOKEN_REFRESH_FAILED: 'Failed to refresh token',
      INVALID_USER_ID: 'Invalid user ID in token',
      INVALID_USER_DATA: 'Invalid user data in token',
    },
  },
  PAYMENT_REQUIRED: {
    code: 402,

    messages: {
      PAYMENT_REQUIRED: 'Payment Required',
    },
  },
  FORBIDDEN: {
    code: 403,

    messages: {
      FORBIDDEN: 'Access denied',
      ACCESS_DENIED: 'Access denied',
    },
  },
  NOT_FOUND: {
    code: 404,

    messages: {
      NOT_FOUND: 'Resource not found',
      USER_NOT_FOUND: 'User not found',
      RECORD_NOT_FOUND: 'Record not found',
      RESOURCE_NOT_FOUND: 'Resource not found',
    },
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    constant: 'METHOD_NOT_ALLOWED',
    messages: {
      METHOD_NOT_ALLOWED: 'Method not allowed',
    },
  },
  NOT_ACCEPTABLE: {
    code: 406,
    messages: {
      NOT_ACCEPTABLE: 'Not acceptable',
    },
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    code: 407,
    messages: {
      PROXY_AUTHENTICATION_REQUIRED: 'Proxy authentication required',
    },
  },
  REQUEST_TIMEOUT: {
    code: 408,
    messages: {
      REQUEST_TIMEOUT: 'Request timeout',
    },
  },
  CONFLICT: {
    code: 409,
    messages: {
      CONFLICT: 'Conflict',
    },
  },
  GONE: {
    code: 410,
    messages: {
      GONE: 'Gone',
    },
    reasonPhrase: 'Gone',
  },
  LENGTH_REQUIRED: {
    code: 411,
    messages: {
      LENGTH_REQUIRED: 'Length required',
    },
  },
  PRECONDITION_FAILED: {
    code: 412,
    messages: {
      PRECONDITION_FAILED: 'Precondition failed',
    },
  },
  CONTENT_TOO_LARGE: {
    code: 413,
    messages: {
      CONTENT_TOO_LARGE: 'Content too large',
    },
  },
  REQUEST_URI_TOO_LONG: {
    code: 414,
    messages: {
      REQUEST_URI_TOO_LONG: 'Request URI too long',
    },
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 415,
    messages: {
      UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type',
    },
  },
  REQUESTED_RANGE_NOT_SATISFIABLE: {
    code: 416,
    messages: {
      REQUESTED_RANGE_NOT_SATISFIABLE: 'Requested range not satisfiable',
    },
  },
  EXPECTATION_FAILED: {
    code: 417,
    messages: {
      EXPECTATION_FAILED: 'Expectation failed',
    },
  },
  METHOD_FAILURE: {
    code: 420,
    messages: {
      METHOD_FAILURE: 'Method failure',
    },
  },
  MISDIRECTED_REQUEST: {
    code: 421,
    messages: {
      MISDIRECTED_REQUEST: 'Misdirected request',
    },
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    messages: {
      UNPROCESSABLE_ENTITY: 'Unprocessable entity',
    },
  },
  LOCKED: {
    code: 423,
    messages: {
      LOCKED: 'Locked',
    },
  },
  FAILED_DEPENDENCY: {
    code: 424,
    messages: {
      FAILED_DEPENDENCY: 'Failed dependency',
    },
  },
  UPGRADE_REQUIRED: {
    code: 426,
    messages: {
      UPGRADE_REQUIRED: 'Upgrade required',
    },
  },
  PRECONDITION_REQUIRED: {
    code: 428,
    messages: {
      PRECONDITION_REQUIRED: 'Precondition required',
    },
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    messages: {
      TOO_MANY_REQUESTS: 'Too many requests',
    },
  },
  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    code: 431,
    messages: {
      REQUEST_HEADER_FIELDS_TOO_LARGE: 'Request header fields too large',
    },
  },
  UNAVAILABLE_FOR_LEGAL_REASONS: {
    code: 451,

    messages: {
      UNAVAILABLE_FOR_LEGAL_REASONS: 'Unavailable for legal reasons',
    },
  },

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: {
    code: 500,
    messages: {
      INTERNAL_SERVER_ERROR: 'Internal server error',
      DATABASE_CONNECTION_ERROR: 'Database connection error',
      QUERY_ERROR: 'Query execution error',
      DUPLICATE_ENTRY: 'Duplicate record',
      CONSTRAINT_VIOLATION: 'Constraint violation',
    },
  },
  NOT_IMPLEMENTED: {
    code: 501,
    messages: {
      NOT_IMPLEMENTED: 'Not implemented',
    },
  },
  BAD_GATEWAY: {
    code: 502,
    messages: {
      BAD_GATEWAY: 'Bad gateway',
    },
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    messages: {
      SERVICE_UNAVAILABLE: 'Service unavailable',
      TIMEOUT: 'Request timeout exceeded',
    },
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    messages: {
      GATEWAY_TIMEOUT: 'Gateway timeout',
    },
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    code: 505,
    messages: {
      HTTP_VERSION_NOT_SUPPORTED: 'HTTP version not supported',
    },
  },
  INSUFFICIENT_STORAGE: {
    code: 507,
    messages: {
      INSUFFICIENT_STORAGE: 'Insufficient storage',
    },
  },
  NETWORK_AUTHENTICATION_REQUIRED: {
    code: 511,
    messages: {
      NETWORK_AUTHENTICATION_REQUIRED: 'Network authentication required',
    },
  },
};

export default HttpStatus;
