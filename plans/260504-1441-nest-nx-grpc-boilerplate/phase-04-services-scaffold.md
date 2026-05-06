# Phase 04 — Service-A & Service-B Scaffolds

## Generate
```
pnpm nx g @nx/nest:app packages/apps/service-a --linter=eslint --unitTestRunner=jest --strict
pnpm nx g @nx/nest:app packages/apps/service-b --linter=eslint --unitTestRunner=jest --strict
```

## Per-Service Structure
```
packages/apps/service-{a,b}/
├── src/
│   ├── main.ts                   # calls bootstrap from @org/nest-core
│   ├── app.module.ts
│   ├── ping.controller.ts        # @GrpcMethod handlers
│   └── service-b.client.ts       # gRPC client (only in service-a, mirror in service-b)
├── project.json
├── tsconfig.app.json
└── Dockerfile (phase 06)
```

## main.ts (service-a)
```ts
import { bootstrap } from '@org/nest-core';
import { PROTO_DIR } from '@org/proto';
import { join } from 'node:path';
import { AppModule } from './app.module';

bootstrap(AppModule, {
  name: 'service-a',
  grpc: { package: 'org.servicea.v1', protoPath: join(PROTO_DIR, 'service-a.proto'), url: process.env.GRPC_URL! },
  http: { port: Number(process.env.PORT ?? 3000) },
});
```

## app.module.ts (service-a)
- `ConfigModule.forRoot` from `@org/nest-core`
- `LoggerModule.forRoot` (pino)
- `ClientsModule.register([{ name:'SERVICE_B', transport:Transport.GRPC, options:{ package:'org.serviceb.v1', protoPath: join(PROTO_DIR,'service-b.proto'), url: process.env.SERVICE_B_URL! } }])`
- Provides `PingController`

## PingController (service-a)
```ts
@Controller()
export class PingController implements OnModuleInit {
  private bClient: ServiceBClient;
  constructor(@Inject('SERVICE_B') private client: ClientGrpc) {}
  onModuleInit() { this.bClient = this.client.getService<ServiceBClient>('ServiceB'); }
  @GrpcMethod('ServiceA','Ping')
  async ping(req: PingRequest) {
    const echo = await firstValueFrom(this.bClient.echo({ msg: req.msg }));
    return { reply: `a-pong:${echo.msg}` };
  }
}
```

Service-B mirrors w/ `Echo` handler (no upstream call).

## Validation
- `pnpm nx serve service-a` + `pnpm nx serve service-b`
- grpcurl `ServiceA.Ping` → returns `a-pong:hello`
- Swagger `http://localhost:3000/docs` reachable in dev

## Risks
- Two services on same machine need distinct `GRPC_URL` ports (50051, 50052) + HTTP ports (3000, 3001).
- Circular gRPC: keep service-a → service-b only to avoid demo confusion.
