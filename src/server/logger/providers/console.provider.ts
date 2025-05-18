// Este módulo só deve ser usado no servidor
import 'server-only';

import { LogLevel } from '../types';

interface ConsoleNotificationProviderConfig {
  /** Whether to enable colored output (default: true) */
  colors?: boolean;
  /** Whether to include timestamps (default: true) */
  timestamps?: boolean;
  /** Whether to include metadata (default: true) */
  metadata?: boolean;
}

export class ConsoleNotificationProvider {
  private readonly config: Required<ConsoleNotificationProviderConfig>;
  private readonly colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    // Text colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',

    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
  };

  constructor(config: ConsoleNotificationProviderConfig = {}) {
    this.config = {
      colors: true,
      timestamps: true,
      metadata: true,
      ...config,
    };
  }

  async notify(params: {
    level: LogLevel;
    message: string;
    context?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
  }): Promise<void> {
    const { level, message, context, metadata = {}, timestamp } = params;
    const { colors: useColors, timestamps, metadata: showMetadata } = this.config;

    // Format timestamp
    const timestampStr = timestamps
      ? this.formatWithColor(`[${timestamp.toISOString()}] `, 'dim')
      : '';

    // Format level
    const levelStr = this.formatLevel(level);

    // Format context
    const contextStr = context ? this.formatWithColor(`[${context}] `, 'blue') : '';

    // Format message
    const messageStr = this.formatWithColor(message, this.getMessageColor(level));

    // Build the log line
    let logLine = `${timestampStr}${levelStr} ${contextStr}${messageStr}`;

    // Add metadata if enabled
    if (showMetadata && Object.keys(metadata).length > 0) {
      const metadataStr = Object.entries(metadata)
        .map(([key, value]) => {
          const formattedValue =
            typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
          return `  ${this.formatWithColor(key, 'cyan')}: ${formattedValue}`;
        })
        .join('\n');

      logLine += `\n${metadataStr}`;
    }

    // Output to console based on level
    const consoleMethod = this.getConsoleMethod(level);
    console[consoleMethod](logLine);
  }

  private formatLevel(level: LogLevel): string {
    const { colors: useColors } = this.config;

    const levelMap = {
      [LogLevel.ERROR]: { text: 'ERROR', color: 'red' as const },
      [LogLevel.WARN]: { text: 'WARN ', color: 'yellow' as const },
      [LogLevel.INFO]: { text: 'INFO ', color: 'green' as const },
      [LogLevel.DEBUG]: { text: 'DEBUG', color: 'magenta' as const },
    };

    const { text, color } = levelMap[level] || {
      text: level.toUpperCase(),
      color: 'white' as const,
    };
    return this.formatWithColor(`[${text}]`, color);
  }

  private getMessageColor(level: LogLevel): keyof ConsoleNotificationProvider['colors'] {
    switch (level) {
      case LogLevel.ERROR:
        return 'red';
      case LogLevel.WARN:
        return 'yellow';
      case LogLevel.INFO:
        return 'white';
      case LogLevel.DEBUG:
        return 'magenta';
      default:
        return 'white';
    }
  }

  private getConsoleMethod(level: LogLevel): 'error' | 'warn' | 'info' | 'debug' {
    switch (level) {
      case LogLevel.ERROR:
        return 'error';
      case LogLevel.WARN:
        return 'warn';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.DEBUG:
        return 'debug';
      default:
        return 'info';
    }
  }

  private formatWithColor(
    text: string,
    color: keyof ConsoleNotificationProvider['colors'],
  ): string {
    if (!this.config.colors) return text;
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }
}
