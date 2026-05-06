import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Transport, type GrpcOptions, type MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import type { Type } from '@nestjs/common';
import { addReflection } from 'grpc-server-reflection';
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

  // gRPC reflection is dev-only — same gating as Swagger.
  const reflectionEnabled =
    process.env['NODE_ENV'] !== 'production' && Boolean(opts.grpc.descriptorPath);
  const descriptorPath = opts.grpc.descriptorPath;
  const grpcOptions: GrpcOptions['options'] = {
    package: opts.grpc.package,
    protoPath: opts.grpc.protoPath,
    url: opts.grpc.url,
    ...(reflectionEnabled && {
      onLoadPackageDefinition: (_pkg, server) => {
        addReflection(server, descriptorPath!);
      },
    }),
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
