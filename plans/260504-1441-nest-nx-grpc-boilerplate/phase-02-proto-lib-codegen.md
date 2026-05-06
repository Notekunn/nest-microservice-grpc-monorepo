# Phase 02 — Proto Lib + Buf + ts-proto

## Overview
Single Nx lib `@org/proto` holding `.proto` sources, ts-proto generated output, Buf lint/breaking, postinstall + build-dep codegen.

## Steps
1. `pnpm nx g @nx/js:lib packages/libs/proto --importPath=@org/proto --bundler=tsc --unitTestRunner=none --linter=eslint`.
2. Layout:
   ```
   packages/libs/proto/
   ├── src/
   │   ├── proto/service-a.proto
   │   ├── src/proto/service-b.proto
   │   ├── generated/   # gitignored
   │   └── index.ts     # export * from './generated', export PROTO_PATH constants
   ├── buf.yaml
   ├── buf.gen.yaml
   └── project.json
   ```
3. `buf.yaml`: `version: v2`, `lint.use: [STANDARD]`, `breaking.use: [FILE]`.
4. `buf.gen.yaml`: plugin `ts-proto` w/ opts `nestJs=true,outputServices=grpc-js,esModuleInterop=true,fileSuffix=.pb`.
5. Add devDeps: `@bufbuild/buf ts-proto`.
6. `project.json` targets:
   - `generate`: `buf generate` (cwd = lib dir), output to `src/generated/`.
   - `lint-proto`: `buf lint`.
   - `breaking`: `buf breaking --against ".git#branch=main,subdir=packages/libs/proto"`.
   - `build` deps `^generate` so any consumer triggers codegen.
7. Root `package.json` `postinstall`: `pnpm nx run proto:generate`.
8. Define example RPCs:
   - `service-a.proto` package `org.servicea.v1` — `rpc Ping(PingRequest) returns (PingReply)`.
   - `service-b.proto` package `org.serviceb.v1` — `rpc Echo(EchoRequest) returns (EchoReply)`.
9. `index.ts` export:
   ```ts
   export * from './generated/proto/service-a.pb';
   export * from './generated/proto/service-b.pb';
   import { join } from 'node:path';
   // Resolve raw .proto dir relative to compiled JS location.
   // After tsc: dist/packages/libs/proto/src/index.js → ../proto contains copied .proto files (see assets below).
   export const PROTO_DIR = join(__dirname, 'proto');
   ```

10. **Copy raw `.proto` to dist** — Nx `@nx/js:tsc` `assets` config in `packages/libs/proto/project.json`:
    ```json
    "build": {
      "executor": "@nx/js:tsc",
      "options": {
        "outputPath": "dist/packages/libs/proto",
        "main": "packages/libs/proto/src/index.ts",
        "tsConfig": "packages/libs/proto/tsconfig.lib.json",
        "assets": [
          { "input": "packages/libs/proto/src/proto", "glob": "**/*.proto", "output": "src/proto" }
        ]
      }
    }
    ```
    Result: `dist/packages/libs/proto/src/proto/*.proto` ships next to compiled JS.
11. **Service Dockerfile** copies them into image:
    ```dockerfile
    COPY --from=build /repo/dist/packages/libs/proto/src/proto /app/proto
    ENV PROTO_DIR=/app/proto
    ```
    Override `PROTO_DIR` env so `@org/proto`'s constant points to the runtime location (services pass `process.env.PROTO_DIR ?? PROTO_DIR` if needed).
12. Alt simpler approach: services import via `require.resolve('@org/proto/proto/service-a.proto')`-style, but env override is more explicit + KISS.

## Files
Create lib + buf configs + 2 protos. Modify root `package.json` postinstall.

## Validation
- `pnpm nx run proto:generate` produces `*.pb.ts`
- `pnpm nx run proto:lint-proto` clean
- TS imports `import { ServiceAClient } from '@org/proto'` resolve
- `pnpm nx build proto` → `dist/packages/libs/proto/src/proto/*.proto` exist alongside `*.js`
- Built service starts and `protoLoader.load(PROTO_DIR + '/service-a.proto')` resolves at runtime

## Risks
- ts-proto + grpc-js Nest decorators path: confirm `nestJs=true` outputs `@GrpcMethod` compatible interfaces.
- `__dirname` resolution under tsc vs swc — verify `PROTO_DIR` works at runtime in built dist.
