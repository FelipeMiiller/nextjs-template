export interface LoggerConfig {
  defaultContext?: string;
  enableAudit?: boolean;
  notificationLevels?: LogLevel[];
  defaultAudit?: boolean;
}

export const defaultLoggerConfig: LoggerConfig = {
  defaultContext: 'Application',
  enableAudit: false,
  notificationLevels: ['error', 'warn'],
  defaultAudit: true,
};
