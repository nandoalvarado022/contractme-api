# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:24-alpine
ARG BUN_VERSION=1.4.0


FROM ${NODE_IMAGE} AS base

ARG BUN_VERSION

RUN npm install -g bun@${BUN_VERSION} \
    && npm cache clean --force

WORKDIR /app


FROM base AS dev-deps

COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile


FROM base AS prod-deps

COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production


FROM base AS build

COPY --from=dev-deps /app/node_modules ./node_modules
COPY package.json bun.lock nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN bun run build


FROM ${NODE_IMAGE} AS production

ENV NODE_ENV=production \
    PORT=3000 \
    NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
    CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/',timeout:4000},r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/main.js"]
