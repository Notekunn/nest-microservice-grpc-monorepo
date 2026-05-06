import { bootstrap } from '@nest-mono/nest-core';
import { SERVICE_B_PROTO } from '@nest-mono/proto';
import { AppModule } from './app/app.module';

void bootstrap(AppModule, {
  name: 'service-b',
  grpc: {
    package: 'nestmono.serviceb.v1',
    protoPath: SERVICE_B_PROTO,
    url: process.env.GRPC_URL ?? '0.0.0.0:50052',
  },
  http: { port: Number(process.env.PORT ?? 3001) },
});
