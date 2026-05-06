import { z } from 'zod';

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

export function validateEnv<T extends z.ZodTypeAny>(schema: T) {
  return (config: Record<string, unknown>): z.infer<T> => {
    const parsed = schema.safeParse(config);
    if (!parsed.success) {
      throw new Error(`Invalid environment: ${JSON.stringify(parsed.error.format())}`);
    }
    return parsed.data;
  };
}
