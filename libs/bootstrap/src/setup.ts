import fastifyHelmet from '@fastify/helmet';
import { AppConfiguration } from '@nest-mono/configuration';
import { getProtoPath } from '@nest-mono/shared-grpc';
import { Logger, Type, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';

import { setupSwagger } from './swagger';

export interface SetupGrpcOptions {
  enabled: boolean;
  protoFiles: string[];
  package: string;
  url: string;
}

export interface SetupOptions {
  grpc?: SetupGrpcOptions;
  useKafka?: boolean;
  useTcp?: boolean;
  disableMorgan?: boolean;
}

export async function setup(
  mainModule: Type<any>,
  options: SetupOptions
): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    mainModule,
    new FastifyAdapter()
  );

  const logger = new Logger(setup.name);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfiguration>('app');

  if (!appConfig) {
    throw new Error('App configuration is not defined');
  }
  const { host, httpPort, grpcPort, tcpPort, version, corsOrigins } = appConfig;

  if (options.grpc?.enabled) {
    logger.log('[Microservice] GRPC transport layer is enabled');
    app.connectMicroservice<GrpcOptions>({
      transport: Transport.GRPC,
      options: {
        package: options.grpc.package,
        protoPath: getProtoPath(options.grpc.protoFiles),
        url: `0.0.0.0:${grpcPort}`,
        keepalive: {
          keepaliveTimeMs: 600000,
          keepaliveTimeoutMs: 300000,
          keepalivePermitWithoutCalls: 1,
        },
      },
    });
  }

  if (options.disableMorgan) {
    app.use(morgan('common'));
  }

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // TODO: update global exception filter

  if (process.env['NODE_ENV'] !== 'production') {
    setupSwagger(app, version);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort, host);

  logger.log(
    `🚀 Application is running on: http://${host}:${httpPort}, tcp://${host}:${tcpPort}, grpc://${host}:${grpcPort}`
  );
  return app;
}
