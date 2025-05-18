/**
 * @file Logger principal para aplicações Next.js
 * @description Suporta contexto, metadados, registro de auditoria e notificações
 * @note Este módulo só deve ser usado no lado do servidor
 */

import { format, createLogger, transports, Logger as WinstonLogger } from 'winston';
import { LogLevel, LogMetadata, LoggerOptions, NotificationService } from './types';

import { formatDateSimple } from 'src/lib/utils/formatDate';
import { HttpException } from 'src/lib/exceptions/exceptions';
import { LoggerConfig } from './config';

import { SlackNotificationProvider } from './providers/slack.provider';
import { ConsoleNotificationProvider } from './providers/console.provider';

/**
 * Serviço de logger aprimorado para aplicações Next.js
 * Suporta contexto, metadados, registro de auditoria e notificações
 */
export class Logger {
  private static instance: Logger;
  private logger: WinstonLogger;
  private context: string;
  private idempotencyKey?: string;
  private config: LoggerConfig;

  /**
   * Construtor privado para implementar o padrão Singleton
   * @param options Opções de configuração do logger
   */
  private constructor(options: LoggerOptions = {}) {
    this.context = options.context || 'Application';
    this.idempotencyKey = options.idempotencyKey;
    this.config = {
      enableAudit: options.enableAudit || false,
      defaultAudit: options.enableAudit !== false, // Default to true if not explicitly disabled
      notificationService: {
        enabled: options.notificationService?.enabled ?? true,
        levels: options.notificationService?.levels || [LogLevel.ERROR, LogLevel.WARN],
      },
    };

    this.logger = createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, ...meta }) => {
              const { context, stackTrace, statusCode, errorCode, ...restMeta } =
                meta as LogMetadata;

              const ts =
                formatDateSimple(timestamp as string, true) ||
                new Date(timestamp as string).toISOString();
              const contextStr = context ? `[${context}]` : '';
              const idempotencyStr = this.idempotencyKey ? `[${this.idempotencyKey}]` : '';
              const statusStr = statusCode ? `[${statusCode}]` : '';
              const errorCodeStr = errorCode ? `[${errorCode}]` : '';

              const logMessage =
                `${ts} ${level} ${statusStr}${errorCodeStr} ${idempotencyStr} ${contextStr} ${message}`
                  .replace(/\s+/g, ' ')
                  .trim();

              // Add metadata if exists
              const metaStr =
                Object.keys(restMeta).length > 0 ? `\n${JSON.stringify(restMeta, null, 2)}` : '';

              // Add stack trace for errors
              const stackStr = stackTrace ? `\n${stackTrace}` : '';

              return `${logMessage}${metaStr}${stackStr}`;
            }),
          ),
        }),
      ],
      exitOnError: false,
    });
  }

  /**
   * Obtém ou cria uma instância do logger (Singleton)
   */
  public static getInstance(options?: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    } else if (options) {
      // Atualiza configurações para instância existente
      if (options.context) Logger.instance.context = options.context;
      if (options.idempotencyKey) Logger.instance.idempotencyKey = options.idempotencyKey;
      if (options.enableAudit !== undefined)
        Logger.instance.config.enableAudit = options.enableAudit;
      if (options.notificationService) {
        Logger.instance.config.notificationService = {
          ...Logger.instance.config.notificationService,
          ...options.notificationService,
        };
      }
    }

    return Logger.instance;
  }

  /**
   * Define o contexto para o logger
   */
  public setContext(context: string): void {
    this.context = context;
  }

  /**
   * Define a chave de idempotência para o logger
   */
  public setIdempotencyKey(key: string): void {
    this.idempotencyKey = key;
  }

  /**
   * Registra uma mensagem de erro
   */
  public error(
    message: string,
    error?: Error | HttpException,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = true,
  ): void {
    const statusCode = error instanceof HttpException ? error.status : undefined;
    const errorCode = error?.constructor.name.replace('Exception', '') || 'UNKNOWN_ERROR';
    let stackTrace: string | undefined =
      error && typeof error === 'object' && 'stack' in error
        ? (error as Error).stack
        : typeof error === 'string'
          ? error
          : undefined;
    // Novo: tenta pegar de error.cause.stack
    if (
      !stackTrace &&
      error &&
      typeof error === 'object' &&
      'cause' in error &&
      error.cause &&
      typeof error.cause === 'object' &&
      'stack' in error.cause
    ) {
      stackTrace = (error.cause as any).stack;
    }
    // Fallback: tenta extrair stackTrace do rawError (inclusive nested causes)
    if (!stackTrace && error) {
      try {
        const raw = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        // Tenta pegar o primeiro stack que encontrar (até nested cause)
        const match = raw.match(/"stack":\s*"([^"]+)"/);
        if (match && match[1]) {
          stackTrace = match[1].replace(/\\n/g, '\n');
        }
      } catch {}
    }
    const meta: LogMetadata = {
      context: this.context,
      idempotency: this.idempotencyKey,
      statusCode,
      errorCode,
      ...metadata,
      errorName: error?.name ?? (typeof error === 'string' ? 'StringError' : undefined),
      errorMessage: error?.message ?? (typeof error === 'string' ? error : undefined),
      stackTrace,
      rawError: error ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2) : undefined,
    };

    this.logger.error(message, meta);

    // Envia para o serviço de notificações se estiver habilitado
    if (notify) this.sendNotification(LogLevel.ERROR, message, meta);
  }

  /**
   * Registra uma mensagem de aviso
   */
  public warn(
    message: string,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = true,
  ): void {
    const meta: LogMetadata = {
      context: this.context,
      idempotency: this.idempotencyKey,
      ...metadata,
    };

    this.logger.warn(message, meta);

    // Envia para o serviço de notificações se estiver habilitado
    if (notify) this.sendNotification(LogLevel.WARN, message, meta);
  }

  /**
   * Registra uma mensagem informativa
   */
  public info(
    message: string,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = true,
  ): void {
    const meta: LogMetadata = {
      context: this.context,
      idempotency: this.idempotencyKey,
      ...metadata,
    };

    this.logger.info(message, meta);

    if (notify) this.sendNotification(LogLevel.INFO, message, meta);
  }

  /**
   * Registra uma mensagem de depuração
   */
  public debug(
    message: string,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = false,
  ): void {
    if (process.env.NODE_ENV === 'production') return;

    const meta: LogMetadata = {
      context: this.context,
      idempotency: this.idempotencyKey,
      ...metadata,
    };

    this.logger.debug(message, meta);

    if (notify) this.sendNotification(LogLevel.DEBUG, message, meta);
  }

  /**
   * Envia uma notificação para o serviço de notificações
   */
  private async sendNotification(
    level: LogLevel,
    message: string,
    metadata: LogMetadata,
  ): Promise<void> {
    try {
      // Check for Slack webhook URL in environment variables
      const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
      let provider: NotificationService | null = null;
      if (slackWebhookUrl) {
        try {
          provider = new SlackNotificationProvider(slackWebhookUrl);

          console.log('Slack notification provider initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Slack notification provider:', error);
          // Fall back to console provider if Slack initialization fails
          provider = new ConsoleNotificationProvider({
            colors: true,
            timestamps: true,
            metadata: true,
          });
        }
      } else if (process.env.NODE_ENV !== 'production') {
        // Use console provider in development by default
        provider = new ConsoleNotificationProvider({
          colors: true,
          timestamps: true,
          metadata: true,
        });
      }

      if (!provider) {
        // No provider available, skip notification
        return;
      }

      await provider.notify({
        level,
        message,
        context: metadata.context || this.context,
        metadata: {
          ...metadata,
          stackTrace: undefined,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Falha ao enviar notificação:', error);
    }
  }
}
