import { Logger, Type, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import fastifyHelmet from '@fastify/helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';
import { AppConfiguration } from '@nest-mono/configuration';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import { setupSwagger } from './swagger';

export interface SetupOptions {
  useGrpc?: boolean;
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
  const { host, httpPort, grpcPort, version } = appConfig;
  if (options.disableMorgan) {
    app.use(morgan('common'));
  }

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  if (process.env['NODE_ENV'] !== 'production') {
    setupSwagger(app, version);
  }

  if (options.useGrpc) {
    logger.log('[Microservice] GRPC transport layer is enabled');
    app.connectMicroservice<GrpcOptions>({
      transport: Transport.GRPC,
      options: {
        package: 'payment',
        protoPath: '..',
        url: `0.0.0.0:${grpcPort}`,
        keepalive: {
          keepaliveTimeMs: 600000,
          keepaliveTimeoutMs: 300000,
          keepalivePermitWithoutCalls: 1,
        },
      },
    });
  }

  app.enableCors({
    // origin: corsOrigins.length > 0 ? corsOrigins : '*',
    origin: '*',
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
  await app.listen(httpPort, host);

  logger.log(`server running on ${host}:${httpPort}`);
  return app;
}
