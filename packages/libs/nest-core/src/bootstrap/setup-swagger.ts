import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  name: string;
  path?: string;
  description?: string;
  version?: string;
}

export function setupSwagger(app: NestFastifyApplication, opts: SwaggerOptions): void {
  if (process.env['NODE_ENV'] === 'production') return;
  const config = new DocumentBuilder()
    .setTitle(opts.name)
    .setDescription(opts.description ?? `${opts.name} API`)
    .setVersion(opts.version ?? process.env['npm_package_version'] ?? '0.0.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(opts.path ?? 'docs', app, doc);
}
