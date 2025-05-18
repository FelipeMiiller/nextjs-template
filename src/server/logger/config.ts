'use server';

import { LogLevel } from './types';

/**
 * Interface de configuração do logger
 * Apenas para uso no lado do servidor
 */
export interface LoggerConfig {
  /** Contexto padrão para as mensagens de log */
  defaultContext?: string;

  /** Habilita o registro de auditoria */
  enableAudit?: boolean;

  /** Níveis de log que devem gerar notificações */
  notificationLevels?: LogLevel[];

  /** Se as mensagens devem ser registradas em auditoria por padrão */
  defaultAudit?: boolean;

  /** Configuração do serviço de notificações */
  notificationService?: {
    /** Habilita/desabilita o serviço de notificações */
    enabled?: boolean;

    /** Níveis de log que devem gerar notificações */
    levels?: LogLevel[];
  };
}

/**
 * Configuração padrão do logger
 * Apenas para uso no lado do servidor
 */
export const defaultLoggerConfig: LoggerConfig = {
  defaultContext: 'Application',
  enableAudit: false,
  defaultAudit: true,
  notificationService: {
    enabled: true,
    levels: [LogLevel.ERROR, LogLevel.WARN],
  },
};
