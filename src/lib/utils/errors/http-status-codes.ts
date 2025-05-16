const HTTP_STATUS = {
  // 1xx Informational
  CONTINUE: {
    code: 100,
    constant: 'CONTINUE',
    reasonPhrase: 'Continue',
  },
  SWITCHING_PROTOCOLS: {
    code: 101,
    constant: 'SWITCHING_PROTOCOLS',
    reasonPhrase: 'Switching Protocols',
  },
  PROCESSING: {
    code: 102,
    constant: 'PROCESSING',
    reasonPhrase: 'Processing',
  },
  EARLY_HINTS: {
    code: 103,
    constant: 'EARLY_HINTS',
    reasonPhrase: 'Early Hints',
  },

  // 2xx Success
  OK: {
    code: 200,
    constant: 'OK',
    reasonPhrase: 'OK',
  },
  CREATED: {
    code: 201,
    constant: 'CREATED',
    reasonPhrase: 'Created',
  },
  ACCEPTED: {
    code: 202,
    constant: 'ACCEPTED',
    reasonPhrase: 'Accepted',
  },
  NON_AUTHORITATIVE_INFORMATION: {
    code: 203,
    constant: 'NON_AUTHORITATIVE_INFORMATION',
    reasonPhrase: 'Non Authoritative Information',
  },
  NO_CONTENT: {
    code: 204,
    constant: 'NO_CONTENT',
    reasonPhrase: 'No Content',
  },
  RESET_CONTENT: {
    code: 205,
    constant: 'RESET_CONTENT',
    reasonPhrase: 'Reset Content',
  },
  PARTIAL_CONTENT: {
    code: 206,
    constant: 'PARTIAL_CONTENT',
    reasonPhrase: 'Partial Content',
  },
  MULTI_STATUS: {
    code: 207,
    constant: 'MULTI_STATUS',
    reasonPhrase: 'Multi-Status',
  },

  // 3xx Redirection
  MULTIPLE_CHOICES: {
    code: 300,
    constant: 'MULTIPLE_CHOICES',
    reasonPhrase: 'Multiple Choices',
  },
  MOVED_PERMANENTLY: {
    code: 301,
    constant: 'MOVED_PERMANENTLY',
    reasonPhrase: 'Moved Permanently',
  },
  MOVED_TEMPORARILY: {
    code: 302,
    constant: 'MOVED_TEMPORARILY',
    reasonPhrase: 'Moved Temporarily',
  },
  SEE_OTHER: {
    code: 303,
    constant: 'SEE_OTHER',
    reasonPhrase: 'See Other',
  },
  NOT_MODIFIED: {
    code: 304,
    constant: 'NOT_MODIFIED',
    reasonPhrase: 'Not Modified',
  },
  USE_PROXY: {
    code: 305,
    constant: 'USE_PROXY',
    reasonPhrase: 'Use Proxy',
  },
  TEMPORARY_REDIRECT: {
    code: 307,
    constant: 'TEMPORARY_REDIRECT',
    reasonPhrase: 'Temporary Redirect',
  },
  PERMANENT_REDIRECT: {
    code: 308,
    constant: 'PERMANENT_REDIRECT',
    reasonPhrase: 'Permanent Redirect',
  },

  // 4xx Client Error
  BAD_REQUEST: {
    code: 400,
    constant: 'BAD_REQUEST',
    reasonPhrase: 'Bad Request',
  },
  UNAUTHORIZED: {
    code: 401,
    constant: 'UNAUTHORIZED',
    reasonPhrase: 'Unauthorized',
  },
  PAYMENT_REQUIRED: {
    code: 402,
    constant: 'PAYMENT_REQUIRED',
    reasonPhrase: 'Payment Required',
  },
  FORBIDDEN: {
    code: 403,
    constant: 'FORBIDDEN',
    reasonPhrase: 'Forbidden',
  },
  NOT_FOUND: {
    code: 404,
    constant: 'NOT_FOUND',
    reasonPhrase: 'Not Found',
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    constant: 'METHOD_NOT_ALLOWED',
    reasonPhrase: 'Method Not Allowed',
  },
  NOT_ACCEPTABLE: {
    code: 406,
    constant: 'NOT_ACCEPTABLE',
    reasonPhrase: 'Not Acceptable',
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    code: 407,
    constant: 'PROXY_AUTHENTICATION_REQUIRED',
    reasonPhrase: 'Proxy Authentication Required',
  },
  REQUEST_TIMEOUT: {
    code: 408,
    constant: 'REQUEST_TIMEOUT',
    reasonPhrase: 'Request Timeout',
  },
  CONFLICT: {
    code: 409,
    constant: 'CONFLICT',
    reasonPhrase: 'Conflict',
  },
  GONE: {
    code: 410,
    constant: 'GONE',
    reasonPhrase: 'Gone',
  },
  LENGTH_REQUIRED: {
    code: 411,
    constant: 'LENGTH_REQUIRED',
    reasonPhrase: 'Length Required',
  },
  PRECONDITION_FAILED: {
    code: 412,
    constant: 'PRECONDITION_FAILED',
    reasonPhrase: 'Precondition Failed',
  },
  REQUEST_TOO_LONG: {
    code: 413,
    constant: 'REQUEST_TOO_LONG',
    reasonPhrase: 'Request Entity Too Large',
  },
  REQUEST_URI_TOO_LONG: {
    code: 414,
    constant: 'REQUEST_URI_TOO_LONG',
    reasonPhrase: 'Request-URI Too Long',
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 415,
    constant: 'UNSUPPORTED_MEDIA_TYPE',
    reasonPhrase: 'Unsupported Media Type',
  },
  REQUESTED_RANGE_NOT_SATISFIABLE: {
    code: 416,
    constant: 'REQUESTED_RANGE_NOT_SATISFIABLE',
    reasonPhrase: 'Requested Range Not Satisfiable',
  },
  EXPECTATION_FAILED: {
    code: 417,
    constant: 'EXPECTATION_FAILED',
    reasonPhrase: 'Expectation Failed',
  },
  IM_A_TEAPOT: {
    code: 418,
    constant: 'IM_A_TEAPOT',
    reasonPhrase: "I'm a teapot",
  },
  INSUFFICIENT_SPACE_ON_RESOURCE: {
    code: 419,
    constant: 'INSUFFICIENT_SPACE_ON_RESOURCE',
    reasonPhrase: 'Insufficient Space on Resource',
  },
  METHOD_FAILURE: {
    code: 420,
    constant: 'METHOD_FAILURE',
    reasonPhrase: 'Method Failure',
  },
  MISDIRECTED_REQUEST: {
    code: 421,
    constant: 'MISDIRECTED_REQUEST',
    reasonPhrase: 'Misdirected Request',
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    constant: 'UNPROCESSABLE_ENTITY',
    reasonPhrase: 'Unprocessable Entity',
  },
  LOCKED: {
    code: 423,
    constant: 'LOCKED',
    reasonPhrase: 'Locked',
  },
  FAILED_DEPENDENCY: {
    code: 424,
    constant: 'FAILED_DEPENDENCY',
    reasonPhrase: 'Failed Dependency',
  },
  UPGRADE_REQUIRED: {
    code: 426,
    constant: 'UPGRADE_REQUIRED',
    reasonPhrase: 'Upgrade Required',
  },
  PRECONDITION_REQUIRED: {
    code: 428,
    constant: 'PRECONDITION_REQUIRED',
    reasonPhrase: 'Precondition Required',
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    constant: 'TOO_MANY_REQUESTS',
    reasonPhrase: 'Too Many Requests',
  },
  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    code: 431,
    constant: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    reasonPhrase: 'Request Header Fields Too Large',
  },
  UNAVAILABLE_FOR_LEGAL_REASONS: {
    code: 451,
    constant: 'UNAVAILABLE_FOR_LEGAL_REASONS',
    reasonPhrase: 'Unavailable For Legal Reasons',
  },

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: {
    code: 500,
    constant: 'INTERNAL_SERVER_ERROR',
    reasonPhrase: 'Internal Server Error',
  },
  NOT_IMPLEMENTED: {
    code: 501,
    constant: 'NOT_IMPLEMENTED',
    reasonPhrase: 'Not Implemented',
  },
  BAD_GATEWAY: {
    code: 502,
    constant: 'BAD_GATEWAY',
    reasonPhrase: 'Bad Gateway',
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    constant: 'SERVICE_UNAVAILABLE',
    reasonPhrase: 'Service Unavailable',
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    constant: 'GATEWAY_TIMEOUT',
    reasonPhrase: 'Gateway Timeout',
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    code: 505,
    constant: 'HTTP_VERSION_NOT_SUPPORTED',
    reasonPhrase: 'HTTP Version Not Supported',
  },
  INSUFFICIENT_STORAGE: {
    code: 507,
    constant: 'INSUFFICIENT_STORAGE',
    reasonPhrase: 'Insufficient Storage',
  },
  NETWORK_AUTHENTICATION_REQUIRED: {
    code: 511,
    constant: 'NETWORK_AUTHENTICATION_REQUIRED',
    reasonPhrase: 'Network Authentication Required',
  },
};

export default HTTP_STATUS;
