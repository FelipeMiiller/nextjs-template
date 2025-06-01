/**
 * @file Logger principal para aplicações Next.js
 * @description Suporta contexto, metadados, registro de auditoria e notificações
 * @note Este módulo só deve ser usado no lado do servidor
 */

import { format, createLogger, transports, Logger as WinstonLogger } from 'winston';
import { LogLevel, LogMetadata, LoggerOptions, NotificationService } from './types';
import { HttpException } from 'src/lib/exceptions/exceptions';
import { LoggerConfig } from './config';
import { SlackNotificationProvider } from './providers/slack.provider';

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
              const ts = new Date(timestamp as string).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
              });
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
  /**
   * Registra uma mensagem de erro com detalhes completos
   * @param message Mensagem de erro
   * @param error Objeto de erro (Error, HttpException ou qualquer outro objeto)
   * @param metadata Metadados adicionais
   * @param notify Se deve enviar notificação
   */
  public error(
    message: string,
    error?: Error | HttpException | unknown,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = true,
  ): void {
    // Extrai informações do erro de forma unificada
    const errorInfo = this.extractErrorInfo(error);

    // Monta objeto de metadados do log
    const meta: LogMetadata = {
      context: this.context,
      idempotency: this.idempotencyKey,
      ...errorInfo,
      // Garante que códigos numéricos sejam convertidos para string
      errorCode: errorInfo.errorCode !== undefined ? String(errorInfo.errorCode) : undefined,
      code: errorInfo.code !== undefined ? String(errorInfo.code) : undefined,
      // Adiciona metadados passados pelo usuário (podem sobrescrever os extraídos)
      ...metadata,
    };

    this.logger.error(message, meta);
    if (notify) this.sendNotification(LogLevel.ERROR, message, meta);
  }

  /**
   * Extrai informações detalhadas de um objeto de erro
   * @private
   */
  private extractErrorInfo(error?: unknown): Partial<LogMetadata> {
    if (!error) return {};

    // Objeto base para armazenar informações extraídas
    const info: Partial<LogMetadata> = {};

    // Extrai informações com base no tipo de erro
    if (error instanceof HttpException) {
      // HttpException já tem todos os campos que precisamos
      Object.assign(info, {
        statusCode: error.status,
        errorCode: error.code || error.constructor.name.replace('Exception', '') || 'UNKNOWN_ERROR',
        stackTrace: error.stackTrace || error.stack,
        errorName: error.name,
        errorMessage: error.message,
        path: error.path,
        method: error.method,
        description: error.description,
        timestamp: error.timestamp,
        originalError: error.originalError,
        cause: error.cause,
        code: error.code,
      });
    } else if (typeof error === 'object') {
      // Para outros objetos, tenta extrair campos comuns
      const errObj = error as any;
      Object.assign(info, {
        statusCode: errObj.status,
        errorCode: errObj.code || errObj.constructor?.name || 'UNKNOWN_ERROR',
        stackTrace: errObj.stack,
        errorName: errObj.name,
        errorMessage: errObj.message,
        path: errObj.path,
        method: errObj.method,
        description: errObj.description,
        timestamp: errObj.timestamp,
        originalError: errObj.originalError,
        cause: errObj.cause,
        code: errObj.code,
      });
    } else if (typeof error === 'string') {
      // Para strings, trata como mensagem de erro simples
      Object.assign(info, {
        errorName: 'StringError',
        errorMessage: error,
      });
    }

    // Tenta extrair stack trace se não foi encontrado
    if (!info.stackTrace && error && typeof error === 'object') {
      try {
        const raw = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        const match = raw.match(/"stack":\s*"([^"]+)"/);
        if (match && match[1]) {
          info.stackTrace = match[1].replace(/\\n/g, '\n');
        }
      } catch {}
    }

    // Serializa o erro original se disponível
    if (
      info.originalError &&
      typeof info.originalError === 'object' &&
      'toJSON' in info.originalError
    ) {
      info.originalError = (info.originalError as any).toJSON();
    }

    // Adiciona representação raw do erro
    if (error) {
      if (typeof error === 'object') {
        try {
          info.rawError = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        } catch {}
      } else if (typeof error === 'string') {
        info.rawError = error;
      }
    }

    return info;
  }

  /**
   * Registra uma mensagem de aviso
   */
  /**
   * Registra uma mensagem de aviso
   * @param message Mensagem de aviso
   * @param metadata Metadados adicionais
   * @param notify Se deve enviar notificação
   */
  public warn(
    message: string,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = true,
  ): void {
    const meta: LogMetadata = this.prepareMetadata(metadata);
    this.logger.warn(message, meta);
    if (notify) this.sendNotification(LogLevel.WARN, message, meta);
  }

  /**
   * Registra uma mensagem informativa
   */
  /**
   * Registra uma mensagem informativa
   * @param message Mensagem informativa
   * @param metadata Metadados adicionais
   * @param notify Se deve enviar notificação
   */
  public info(
    message: string,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = true,
  ): void {
    const meta: LogMetadata = this.prepareMetadata(metadata);
    this.logger.info(message, meta);
    if (notify) this.sendNotification(LogLevel.INFO, message, meta);
  }

  /**
   * Registra uma mensagem de depuração
   */
  /**
   * Registra uma mensagem de depuração
   * @param message Mensagem de depuração
   * @param metadata Metadados adicionais
   * @param notify Se deve enviar notificação
   */
  public debug(
    message: string,
    metadata: Omit<LogMetadata, 'stackTrace'> = {},
    notify: boolean = false,
  ): void {
    if (process.env.NODE_ENV === 'production') return;

    const meta: LogMetadata = this.prepareMetadata(metadata);
    this.logger.debug(message, meta);
    if (notify) this.sendNotification(LogLevel.DEBUG, message, meta);
  }

  /**
   * Envia uma notificação para o serviço de notificações
   */
  /**
   * Prepara metadados padrão para todos os níveis de log
   * @private
   */
  private prepareMetadata(metadata: Partial<LogMetadata> = {}): LogMetadata {
    return {
      context: this.context,
      idempotency: this.idempotencyKey,
      ...metadata,
    } as LogMetadata;
  }

  /**
   * Envia uma notificação para o serviço configurado
   * @private
   */
  private async sendNotification(
    level: LogLevel,
    message: string,
    metadata: LogMetadata,
  ): Promise<void> {
    try {
      // Verifica se há URL do webhook do Slack nas variáveis de ambiente
      const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (!slackWebhookUrl) {
        // Sem webhook configurado, não envia notificação
        return;
      }

      // Inicializa o provider do Slack
      let provider: NotificationService;
      try {
        provider = new SlackNotificationProvider(slackWebhookUrl);
      } catch (error) {
        console.error('Failed to initialize Slack notification provider:', error);
        return;
      }

      // Envia a notificação
      await provider.notify({
        level,
        message,
        context: metadata.context || this.context,
        metadata: {
          ...metadata,
          stackTrace: undefined, // Remove stack trace para notificações
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Falha ao enviar notificação:', error);
    }
  }
}
