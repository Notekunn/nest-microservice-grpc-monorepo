# Brainstorm: Nest + Nx + gRPC Microservice Boilerplate

## Problem
Need monorepo boilerplate: multiple Nest microservices, gRPC inter-service comm, shared proto, shared bootstrap lib (Fastify + filter + swagger dev + logger/config), pre-release tags on `staging` branch.

## Stack Decisions
| Concern | Choice |
|---|---|
| Workspace | Nx 22 + pnpm 10 + Node 24 |
| HTTP | Fastify adapter |
| RPC | @nestjs/microservices gRPC (Transport.GRPC) |
| Proto share | Internal Nx lib `@org/proto` |
| Codegen | ts-proto (`nestJs=true,outputServices=grpc-js`), CI-only (not committed) |
| Versioning | nx release, **independent** per project, conventional commits |
| Pre-release | `staging` → `nx release --specifier=prerelease --preid=rc` → tag `service-a@1.2.0-rc.1` |
| CI | GitLab CI |
| Registry | Custom Harbor |
| Deploy | Dockerfile per service, image tag = nx release version |
| mTLS | k8s layer (infra, not in code) |

## Layout
```
packages/
├── apps/
│   ├── service-a/    # Nest hybrid
│   └── service-b/    # Nest hybrid
└── libs/
    ├── proto/        # .proto + ts-proto generated (gitignored)
    │   ├── src/proto/*.proto
    │   └── src/generated/   # generated, .gitignore
    └── nest-core/    # bootstrap, filter, swagger, logger, config
```

## Shared `@org/nest-core` API
```ts
bootstrap(AppModule, {
  name: 'service-a',
  grpc: { package, protoPath, url: env.GRPC_URL },
  http: { port: env.PORT },
})
```
Internals:
- Fastify adapter
- `connectMicroservice(GRPC)` + reflection + health
- Global `AllExceptionsFilter` (HTTP + RPC dual context)
- Swagger mounted `/docs` when `NODE_ENV!==production`
- nestjs-pino logger
- `@nestjs/config` + zod validation

## gRPC Extras Baked In
- `grpc-server-reflection` for grpcurl/Postman dev DX
- `grpc-health-check` proto for k8s probes
- Fastify `/healthz` `/readyz` for HTTP probes

## Release Flow (nx release, independent)
- `staging` push → CI: `nx release --specifier=prerelease --preid=rc` → per-project tags + changelog → build+push Harbor `harbor.<corp>/<project>/service-a:1.2.0-rc.1`
- `main` push → `nx release` (stable, conventional commits drive bump)
- Affected-only via `nx affected` to skip untouched services

## GitLab CI Stages
`install → lint → typecheck → test → build → release(staging|main) → docker-push`
- Cache pnpm store + Nx cache
- `release` job: needs git push token, runs only on protected branches
- Docker job: kaniko or buildx → Harbor (creds via GitLab CI variables)

## Dockerfile Pattern (per service)
Multi-stage:
1. `node:24-alpine` deps (pnpm fetch + install --frozen-lockfile)
2. Build: `pnpm nx build service-a` + run proto codegen
3. Runtime: copy `dist/apps/service-a` + prod node_modules, `CMD ["node","main.js"]`

## Risks / Trade-offs
- **Independent versioning**: proto compat across services more fragile → mitigate w/ proto changelog rule + backwards-compat lint (buf breaking).
- **CI-only proto codegen**: fresh clone needs `pnpm nx run proto:generate` for IDE → add postinstall hook.
- **Fastify + Swagger 11**: peer-version pinning required; flag in plan.
- **nx release on staging w/ prerelease**: must reset preid counter on stable bump — verify config.

## Success Criteria
- `pnpm nx run-many -t build` green
- `service-a` calls `service-b` via gRPC end-to-end test
- Push to `staging` → Harbor image `*:X.Y.Z-rc.N` exists, tag pushed
- `/docs` reachable in dev, hidden in prod
- Adding 3rd service = `nx g` + minimal wiring (<15 min)

## Resolved Follow-ups
- DB: **stateless** boilerplate
- Proto lint: **Buf** (buf lint + buf breaking on CI)
- Codegen: **postinstall + build dep** (auto)
- Interceptors in nest-core: **OTel tracing + JWT metadata propagation**
- Proto bump policy: **auto-bump dependent services** via nx release dependency detection
- Harbor: **robot account** per-project, creds via GitLab CI vars (placeholder names in boilerplate)

## Open
- (none — ready to plan)
