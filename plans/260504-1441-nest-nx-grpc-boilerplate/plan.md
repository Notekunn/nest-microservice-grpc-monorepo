---
slug: nest-nx-grpc-boilerplate
created: 2026-05-04
status: pending
mode: fast
blockedBy: []
blocks: []
---

# Plan: Nest + Nx + gRPC Microservice Boilerplate

Brainstorm: `../reports/brainstorm-260504-1441-nest-nx-grpc-boilerplate.md`

## Goal
Nx monorepo, 2 Nest hybrid services (Fastify + gRPC), shared proto + nest-core libs, nx release independent w/ pre-release on `staging`, GitLab CI → Harbor.

## Phases
| # | Phase | Status |
|---|---|---|
| 01 | Workspace base config | pending |
| 02 | Proto lib + Buf + ts-proto codegen | done |
| 03 | nest-core shared lib | pending |
| 04 | Service-A + Service-B scaffolds | pending |
| 05 | Inter-service gRPC wiring + E2E | pending |
| 06 | Dockerfiles | pending |
| 07 | nx release config (independent + conventional) | pending |
| 08 | GitLab CI + Harbor | pending |

## Key Decisions (from brainstorm)
- Nx 22, pnpm 10, Node 24
- Independent versioning, auto-bump consumers on proto change
- ts-proto codegen postinstall + build dep, generated dir gitignored
- nest-core: bootstrap, AllExceptionsFilter, Swagger(dev), pino, config+zod, OTel, JWT metadata interceptor
- Stateless services
- gRPC reflection + grpc-health + Fastify /healthz
- Dockerfile per service, multi-stage Node 24-alpine
- Harbor robot account via GitLab CI vars

## Success
- `pnpm nx run-many -t build typecheck lint test` green
- E2E: service-a → service-b gRPC round-trip
- Push staging → Harbor `service-{a,b}:X.Y.Z-rc.N`
- `/docs` only in dev
