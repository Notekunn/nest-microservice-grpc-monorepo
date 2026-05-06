import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Transport, type GrpcOptions, type MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import type { Type } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions-filter.js';
import { setupSwagger } from './setup-swagger.js';
import type { BootstrapOptions } from './bootstrap-options.js';

export async function bootstrap(
  module: Type<unknown>,
  opts: BootstrapOptions,
): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(module, new FastifyAdapter(), {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());

  const grpcOptions: GrpcOptions['options'] = {
    package: opts.grpc.package,
    protoPath: opts.grpc.protoPath,
    url: opts.grpc.url,
  };
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: grpcOptions,
  });

  setupSwagger(app, { name: opts.name, ...opts.swagger });

  await app.startAllMicroservices();
  await app.listen(opts.http.port, opts.http.host ?? '0.0.0.0');

  return app;
}
