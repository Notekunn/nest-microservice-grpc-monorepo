# syntax=docker/dockerfile:1.7
# Build any service: docker build --build-arg SERVICE=service-a -t service-a:dev .
ARG NODE_IMAGE=node:24-alpine
ARG SERVICE

# 1. build: install full deps, run nx prune for the target service
FROM ${NODE_IMAGE} AS build
ARG SERVICE
RUN test -n "${SERVICE}" || (echo "ERROR: --build-arg SERVICE=<name> is required" && exit 1)
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /repo
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm nx run @nest-mono/${SERVICE}:prune \
 && cp -r packages/apps/${SERVICE}/dist /out

# 2. deps: install prod-only deps inside pruned dist (hoisted: webpack externals need flat node_modules)
FROM ${NODE_IMAGE} AS deps
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /app
COPY --from=build /out/ ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile --config.node-linker=hoisted

# 3. runtime: minimal image, non-root
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PROTO_DIR=/app/proto \
    PORT=3000 \
    GRPC_URL=0.0.0.0:50051
COPY --from=deps --chown=node:node /app/ ./
USER node
EXPOSE 3000 50051
CMD ["node", "main.js"]
