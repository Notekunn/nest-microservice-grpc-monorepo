import { ConfigModule, type ConfigModuleOptions } from '@nestjs/config';
import type { DynamicModule } from '@nestjs/common';
import type { z } from 'zod';
import { validateEnv } from './env-schema.js';

export function createConfigModule<T extends z.ZodTypeAny>(
  schema: T,
  opts: ConfigModuleOptions = {},
): DynamicModule | Promise<DynamicModule> {
  return ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    validate: validateEnv(schema) as (config: Record<string, unknown>) => Record<string, unknown>,
    ...opts,
  });
}
