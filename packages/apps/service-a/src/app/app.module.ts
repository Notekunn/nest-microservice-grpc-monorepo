import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { createConfigModule, createPinoConfig } from '@nest-mono/nest-core';
import { SERVICE_B_PROTO } from '@nest-mono/proto';
import { z } from 'zod';
import { PingController } from './ping.controller';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  GRPC_URL: z.string().default('0.0.0.0:50051'),
  SERVICE_B_URL: z.string().default('0.0.0.0:50052'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

@Module({
  imports: [
    createConfigModule(envSchema),
    LoggerModule.forRoot(createPinoConfig()),
    ClientsModule.register([
      {
        name: 'SERVICE_B',
        transport: Transport.GRPC,
        options: {
          package: 'nestmono.serviceb.v1',
          protoPath: SERVICE_B_PROTO,
          url: process.env.SERVICE_B_URL ?? '0.0.0.0:50052',
        },
      },
    ]),
  ],
  controllers: [PingController],
})
export class AppModule {}
