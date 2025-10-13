import { Logger, type INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, version: string): void {
  const logger = new Logger(setupSwagger.name);
  const options = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API Documentation')
    .setVersion(version)
    .addBearerAuth()
    .setDescription('API documentation for the NestJS Boilerplate application')
    .addTag('auth', 'Authenticate user')
    .addTag('user', 'Manage user account')
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'NestJS Boilerplate API Documentation',
  };
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, customOptions);
  logger.log(`Swagger docs available at /docs`);
}
