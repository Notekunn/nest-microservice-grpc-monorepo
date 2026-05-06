# Phase 03 — Shared `@org/nest-core` Lib

## Overview
Reusable bootstrap + cross-cutting concerns for every Nest service.

## Generate
`pnpm nx g @nx/js:lib packages/libs/nest-core --importPath=@org/nest-core --bundler=tsc --unitTestRunner=jest`

## Deps
`@nestjs/common @nestjs/core @nestjs/microservices @nestjs/platform-fastify @nestjs/swagger @nestjs/config @grpc/grpc-js @grpc/proto-loader nestjs-pino pino pino-pretty zod @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node grpc-server-reflection grpc-health-check`

## Structure
```
src/
├── bootstrap/
│   ├── bootstrap.ts          # createApp + start (calls setupSwagger)
│   ├── bootstrap-options.ts  # types
│   └── setup-swagger.ts      # exported helper, used by bootstrap
├── filters/
│   └── all-exceptions.filter.ts   # HTTP + RPC dual context
├── logger/
│   └── pino-config.ts
├── config/
│   ├── env-schema.ts         # zod
│   └── config.module.ts
├── interceptors/
│   ├── otel.interceptor.ts
│   └── grpc-metadata-auth.interceptor.ts   # extract+propagate JWT
├── health/
│   └── grpc-health.service.ts
└── index.ts
```

## setup-swagger.ts (separate, exported)
```ts
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  name: string;
  path?: string;          // default 'docs'
  description?: string;
  version?: string;
}

export function setupSwagger(app: NestFastifyApplication, opts: SwaggerOptions) {
  if (process.env.NODE_ENV === 'production') return;
  const config = new DocumentBuilder()
    .setTitle(opts.name)
    .setDescription(opts.description ?? `${opts.name} API`)
    .setVersion(opts.version ?? process.env.npm_package_version ?? '0.0.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(opts.path ?? 'docs', app, doc);
}
```

## bootstrap.ts API
```ts
import { setupSwagger } from './setup-swagger';

export async function bootstrap(
  module: any,
  opts: {
    name: string;
    grpc: { package: string; protoPath: string; url: string };
    http: { port: number };
    swagger?: { path?: string; description?: string };
  },
) {
  const app = await NestFactory.create<NestFastifyApplication>(module, new FastifyAdapter(), { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: { package: opts.grpc.package, protoPath: opts.grpc.protoPath, url: opts.grpc.url, onLoadPackageDefinition: addReflection },
  });

  setupSwagger(app, { name: opts.name, ...opts.swagger });

  await app.startAllMicroservices();
  await app.listen(opts.http.port, '0.0.0.0');
}
```

`setupSwagger` also re-exported from `index.ts` so services can call it standalone if they skip `bootstrap()`.

## AllExceptionsFilter
- Detects context type via `host.getType()`
- HTTP → JSON `{ statusCode, message, code }`
- RPC → `throw new RpcException({ code: status.INTERNAL, message })`
- Maps Zod/Nest validation → 400 + `INVALID_ARGUMENT`

## env-schema.ts (zod)
```ts
export const envSchema = z.object({
  NODE_ENV: z.enum(['development','staging','production','test']).default('development'),
  PORT: z.coerce.number().default(3000),
  GRPC_URL: z.string().default('0.0.0.0:50051'),
  LOG_LEVEL: z.enum(['debug','info','warn','error']).default('info'),
});
```

## OTel Interceptor
- Wrap `next.handle()` w/ active span; works for HTTP + gRPC.
- Span name = `<context>.<handler>`.

## Validation
- Unit test bootstrap mock + filter mapping
- Lib builds standalone

## Risks
- nestjs-pino + Fastify adapter ordering — must register pino logger BEFORE first request.
- Swagger w/ Fastify needs `@fastify/static` peer.
