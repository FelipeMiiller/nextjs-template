'use server';

import { Logger } from './logger';
import { LoggerOptions } from './types';

/**
 * Cria uma instância de logger com um contexto específico
 * @example
 * const log = createLogger('AuthService');
 * log.info('Usuário autenticado');
 * @param context Contexto do logger (geralmente o nome do módulo)
 * @param options Opções adicionais para o logger
 * @returns Instância do logger configurada
 */
function createLogger(context: string, options?: Omit<LoggerOptions, 'context'>) {
  return Logger.getInstance({ ...options, context });
}

/**
 * Registra uma mensagem de erro
 * @param context Contexto da mensagem (geralmente o nome do módulo)
 * @param error Erro ou mensagem de erro
 * @param extra Dados adicionais para registro
 */
function logError(context: string, error: unknown, extra: Record<string, any> = {}): void {
  const logger = createLogger(context);
  if (error instanceof Error) {
    logger.error(error.message, error, extra);
  } else {
    logger.error(String(error), undefined, extra);
  }
}

/**
 * Registra uma mensagem informativa
 * @param context Contexto da mensagem (geralmente o nome do módulo)
 * @param message Mensagem a ser registrada
 * @param data Dados adicionais para registro
 */
function logInfo(context: string, message: string, data: Record<string, any> = {}): void {
  const logger = createLogger(context);
  logger.info(message, data, true);
}

/**
 * Registra uma mensagem de aviso
 * @param context Contexto da mensagem (geralmente o nome do módulo)
 * @param message Mensagem de aviso
 * @param data Dados adicionais para registro
 */
function logWarn(context: string, message: string, data: Record<string, any> = {}): void {
  const logger = createLogger(context);
  logger.warn(message, data);
}

/**
 * Registra uma mensagem de depuração
 * @param context Contexto da mensagem (geralmente o nome do módulo)
 * @param message Mensagem de depuração
 * @param data Dados adicionais para registro
 */
function logDebug(context: string, message: string, data: Record<string, any> = {}): void {
  const logger = createLogger(context);
  logger.debug(message, data);
}

// Export a default object with all the logging functions

export { createLogger, logError, logInfo, logWarn, logDebug };
