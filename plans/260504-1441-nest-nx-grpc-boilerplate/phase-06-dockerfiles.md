# Phase 06 — Dockerfile per Service

## Pattern (multi-stage, shared across services)
```dockerfile
# 1. base
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /repo

# 2. deps
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/libs/proto/package.json packages/libs/proto/
COPY packages/libs/nest-core/package.json packages/libs/nest-core/
COPY packages/apps/${SERVICE}/package.json packages/apps/${SERVICE}/
RUN pnpm install --frozen-lockfile

# 3. build
FROM deps AS build
COPY . .
RUN pnpm nx run proto:generate
RUN pnpm nx build ${SERVICE} --configuration=production

# 4. runtime
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/dist/packages/apps/${SERVICE} ./
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/packages/libs/proto/src/proto ./proto
EXPOSE 3000 50051
USER node
CMD ["node", "main.js"]
```

## Per-Service Files
- `packages/apps/service-a/Dockerfile` (set ARG SERVICE=service-a)
- `packages/apps/service-b/Dockerfile`
- Or single `Dockerfile` at root + `--build-arg SERVICE=`. Recommend per-service for clarity.

## .dockerignore
`node_modules`, `dist`, `.nx`, `**/coverage`, `**/.git`, `**/src/generated`.

## Validation
`docker build --build-arg SERVICE=service-a -t service-a:dev .` → image runs locally.

## Risks
- Image size: prune dev deps via `pnpm install --prod` in runtime stage if needed.
- Proto path resolution at runtime: bake `PROTO_DIR` env override into Docker `ENV PROTO_DIR=/app/proto`.
