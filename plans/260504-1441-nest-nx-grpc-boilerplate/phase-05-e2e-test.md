# Phase 05 — E2E Inter-Service Test

## Overview
Verify service-a calls service-b via gRPC end-to-end. Run as Nx e2e project.

## Generate
`pnpm nx g @nx/jest:configuration` for new project `e2e/services-grpc`.

## Strategy
- `docker-compose.e2e.yml`: bring up both services (built images or `nx serve` via wait-on).
- Jest test: spawn grpc client to service-a using `@org/proto` types → call `Ping({ msg:'hello' })` → assert `reply` includes `a-pong:hello`.
- Health probes: assert gRPC health `SERVING` for both.

## Files
- `e2e/services-grpc/jest.config.ts`
- `e2e/services-grpc/src/ping.e2e-spec.ts`
- `docker-compose.e2e.yml`

## Validation
`pnpm nx run e2e-services-grpc:e2e` green locally + CI.

## Risks
- Port conflicts in CI runner — use random ports + service discovery via env.
- gRPC client needs proto codegen done first → e2e depends on `proto:generate`.
