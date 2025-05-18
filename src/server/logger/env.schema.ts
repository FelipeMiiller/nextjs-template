import { z } from 'zod';

export const LoggerEnvSchema = z.object({
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  SLACK_CHANNEL: z.string().optional(),
  SLACK_USERNAME: z.string().optional(),
  SLACK_ICON_EMOJI: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  SLACK_LOG_LEVELS: z.string().optional(), // Ex: 'error,warn,info'
});

export type LoggerEnv = z.infer<typeof LoggerEnvSchema>;
