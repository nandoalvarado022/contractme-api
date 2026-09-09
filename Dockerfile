# syntax=docker/dockerfile:1

# ============================================================
# Stage 1: Install dependencies required to build the app
# ============================================================
FROM node:20-bookworm-slim AS build-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci


# ============================================================
# Stage 2: Build NestJS application
# ============================================================
FROM build-deps AS build

WORKDIR /app

COPY . .

RUN npm run build


# ============================================================
# Stage 3: Install production dependencies only
# ============================================================
FROM node:20-bookworm-slim AS production-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# ============================================================
# Stage 4: Production image
# ============================================================
FROM node:20-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
