# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci \
    --prefer-offline \
    --no-audit \
    --no-fund

COPY . .

RUN npm run build

RUN npm prune --omit=dev \
    --no-audit \
    --no-fund


FROM node:20-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]
