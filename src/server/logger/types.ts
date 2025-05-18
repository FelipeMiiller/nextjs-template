/**
 * Available log levels
 */
export enum LogLevel {
  /** Error conditions that require immediate attention */
  ERROR = 'error',

  /** Potentially harmful situations that should be monitored */
  WARN = 'warn',

  /** Informational messages that highlight progress */
  INFO = 'info',

  /** Debug information for development */
  DEBUG = 'debug',
}

/**
 * Error details interface
 */
export interface ErrorDetails {
  /** Error name */
  name?: string;

  /** Error message */
  message: string;

  /** Stack trace */
  stack?: string;

  /** Error cause (for chained errors) */
  cause?: unknown;

  /** Additional error properties */
  [key: string]: unknown;
}

/**
 * Log metadata interface
 */
export interface LogMetadata {
  /** Context for the log message (e.g., module name) */
  context?: string;

  /** Idempotency key for tracking related operations */
  idempotencyKey?: string;

  /** Error details if this is an error log */
  error?: ErrorDetails;

  /** HTTP status code (for API requests) */
  statusCode?: number;

  /** Custom error code */
  errorCode?: string;

  /** Request ID for distributed tracing */
  requestId?: string;

  /** User ID associated with the log */
  userId?: string;

  /** Session ID for the request */
  sessionId?: string;

  /** Timestamp of when the log was created */
  timestamp?: string;

  /** Environment where the log was created */
  environment?: string;

  /** Service name */
  service?: string;

  /** Version of the service */
  version?: string;

  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  /** Default context for log messages */
  context?: string;

  /** Idempotency key for tracking related operations */
  idempotencyKey?: string;

  /** Enable/disable audit logging */
  enableAudit?: boolean;

  /** Service name for logs */
  service?: string;

  /** Environment name (e.g., 'development', 'production') */
  environment?: string;

  /** Application version */
  version?: string;

  /** Notification service configuration */
  notificationService?: {
    /** Enable/disable notification service */
    enabled?: boolean;

    /** Log levels that should trigger notifications */
    levels?: LogLevel[];

    /** Additional notification service options */
    [key: string]: unknown;
  };

  /** Additional logger options */
  [key: string]: unknown;
}

/**
 * Default logger configuration
 */
export const defaultLoggerConfig: LoggerOptions = {
  context: 'app',
  enableAudit: true,
  service: 'nextjs-app',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.APP_VERSION || '1.0.0',
  notificationService: {
    enabled: true,
    levels: [LogLevel.ERROR, LogLevel.WARN],
  },
};

export interface NotificationService {
  notify: (message: {
    level: LogLevel;
    message: string;
    context?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
  }) => Promise<void>;
}
