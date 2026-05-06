import { bootstrap } from '@nest-mono/nest-core';
import { SERVICE_A_DESCRIPTOR, SERVICE_A_PROTO } from '@nest-mono/proto';
import { AppModule } from './app/app.module';

void bootstrap(AppModule, {
  name: 'service-a',
  grpc: {
    package: 'nestmono.servicea.v1',
    protoPath: SERVICE_A_PROTO,
    url: process.env.GRPC_URL ?? '0.0.0.0:50051',
    descriptorPath: SERVICE_A_DESCRIPTOR,
  },
  http: { port: Number(process.env.PORT ?? 3000) },
});
