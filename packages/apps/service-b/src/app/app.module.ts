import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { createConfigModule, createPinoConfig } from '@nest-mono/nest-core';
import { z } from 'zod';
import { EchoController } from './echo.controller';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  GRPC_URL: z.string().default('0.0.0.0:50052'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

@Module({
  imports: [createConfigModule(envSchema), LoggerModule.forRoot(createPinoConfig())],
  controllers: [EchoController],
})
export class AppModule {}
