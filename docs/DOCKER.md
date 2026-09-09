# Docker

The stack is production-only: one `production` image target, no bind mounts and
no watch mode. Local development runs outside Docker with `npm run dev`.

## Files

| File | Role |
|---|---|
| `Dockerfile` | Four stages: `dev-deps`, `prod-deps`, `build`, `production` |
| `docker-compose.yml` | `mysql` + `api` services on a private `contractme` network |
| `.dockerignore` | Second line of defence; the Dockerfile also copies paths explicitly |

## Image

Base is `node:24-alpine`. Alpine is safe here because `package-lock.json`
declares no native builds — `fsevents` is an optional macOS dependency and the
`@nestjs/core` install script only prints a message.

`dev-deps` and `prod-deps` install separately so that BuildKit runs them in
parallel and keeps the production dependency layer cached when only `src`
changes. The alternative, a single install followed by
`npm prune --omit=dev`, re-runs the prune on every source edit.

The build stage must stay on `npm run build` (`nest build`). Plain `tsc` would
not copy `src/assets/email_templates/*.html`, and `src/common/emails/mail.service.ts`
reads those templates at runtime from `dist/assets/email_templates`.

The runtime stage drops to `USER node` and carries only `node_modules` (prod
only), `dist` and `package.json`. Its `HEALTHCHECK` issues an HTTP GET to `/`
and accepts any status below 500, so it verifies the server is listening and
routing without depending on Swagger staying mounted at `/docs`.

## Environment

`src/database/data-source.ts` selects the env family by `NODE_ENV`:
`production` uses `DB_REMOTE_*`, anything else uses `DB_LOCAL_*`.

The `MYSQL_*` family is canonical. The `api` service derives its whole
`DB_REMOTE_*` connection from it, which is why the production `.env` needs only
these four values and no `DB_REMOTE_*` at all:

```
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=contract_me
MYSQL_USER=contractme
MYSQL_PASSWORD=
```

Do not invert that direction. Deriving `MYSQL_DATABASE` from
`${DB_REMOTE_DATABASE}` starts the API with no database credentials on any host
whose `.env` follows the production shape.

`data-source.ts` calls dotenv's `config()`, which does not overwrite variables
that are already set, so the values compose injects win inside the container
even though no `.env` file is copied into the image.

Fill `DB_REMOTE_*` in a local `.env` only to point the host-side typeorm CLI at
the container. It must then mirror `MYSQL_*` on the published loopback port.

## Ports

| Service | Host | Container |
|---|---|---|
| `api` | `${API_BIND_ADDRESS:-127.0.0.1}:${API_HOST_PORT:-3000}` | `3000` |
| `mysql` | `127.0.0.1:${MYSQL_HOST_PORT:-3310}` | `3306` |

The API binds to loopback because a reverse proxy on the host terminates TLS
for `api.contractme.cloud`; Nest itself serves plain HTTP. Set
`API_BIND_ADDRESS=0.0.0.0` for a host with no proxy in front.

MySQL is published off 3306 so it never collides with a MySQL running natively
on the same machine, which is the case on the development machine
(`DB_LOCAL_*`).

## Volume

`docker-compose.yml` deliberately declares no `name:` key. The compose project
name is derived from the directory, so the data volume is
`<directory>_mysql_data` — `apicontractmecloud_mysql_data` under
`/var/www/api.contractme.cloud`. Adding a `name:` key renames the volume and
points the API at an empty database.

`docker compose down -v` destroys that volume. Use `docker compose down`.

## Collation

The server is started with `utf8mb4` / `utf8mb4_0900_ai_ci` to match
`db/snapshots/prod.json`. Without it the container defaults differ from
production on collation-sensitive comparisons.

## Commands

```sh
docker compose up -d --build
docker compose logs -f api
docker compose ps
docker compose down
```

Migrations do not run on boot unless `DB_MIGRATIONS_RUN=true`. To apply them
explicitly:

```sh
docker compose exec api npx typeorm migration:run -d dist/database/data-source.js
docker compose exec api npx typeorm migration:show -d dist/database/data-source.js
```

## Restoring a dump

`./docker/mysql/init` is mounted at `/docker-entrypoint-initdb.d`. Files there
run once, on the first initialisation of an empty volume, so a `.sql` dump
placed in that directory seeds a fresh database. It is ignored once the volume
holds data.
