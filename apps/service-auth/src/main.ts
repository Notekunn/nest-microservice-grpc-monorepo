/**
 * Auth Service - gRPC Microservice
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('AuthService');
  const port = process.env.GRPC_PORT || 5001;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, '../../../libs/shared-grpc/src/proto/auth.proto'),
        url: `0.0.0.0:${port}`,
      },
    }
  );

  await app.listen();
  logger.log(`🔐 Auth Service is running on: 0.0.0.0:${port}`);
}

bootstrap();
