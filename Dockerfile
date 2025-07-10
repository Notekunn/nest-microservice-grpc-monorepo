FROM node:23-slim AS builder

ARG SERVICE_NAME
ARG SERVICE_TAG

RUN corepack enable

WORKDIR /usr/src/build

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts --verbose

COPY . .

RUN pnpm nx build ${SERVICE_NAME}

FROM node:23-slim AS runner

RUN corepack enable

ARG SERVICE_NAME
ARG SERVICE_TAG
ENV SERVICE_NAME=${SERVICE_NAME}
ENV SERVICE_TAG=${SERVICE_TAG}

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/build/apps/${SERVICE_NAME}/dist/ .

RUN pnpm install --prod --frozen-lockfile --ignore-scripts --verbose
RUN pnpm add tslib@^2.3.0

RUN chown node:node /usr/src/app

USER node:node

CMD ["node", "main.js"] 