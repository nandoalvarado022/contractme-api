# Docker

The stack is production-only: one `production` image target, no bind mounts and
no watch mode. Local development runs outside Docker with `bun run dev`.

## Files

| File | Role |
|---|---|
| `Dockerfile` | Five stages: `base`, `dev-deps`, `prod-deps`, `build`, `production` |
| `docker-compose.yml` | `mysql` + `api` services on a private `contractme` network |
| `.dockerignore` | Second line of defence; the Dockerfile also copies paths explicitly |

## Package manager and runtime

Bun installs dependencies. Node.js runs the application. These are two separate
decisions and only the first one changed.

The `base` stage starts from `node:24-alpine` and adds bun with
`npm install -g bun@${BUN_VERSION}`. Both binaries have to be present during
the build because `node_modules/.bin/nest` carries a `#!/usr/bin/env node`
shebang: `bun run build` honours that shebang and shells out to Node. A
bun-only image would fail there.

The `production` stage starts from `node:24-alpine` again, so bun is absent
from the shipped image. Nothing at runtime needs it — the entrypoint is
`node dist/main.js`.

`bun install --frozen-lockfile` is the equivalent of `npm ci`: it installs the
exact tree in `bun.lock`, and fails instead of resolving when the lockfile and
`package.json` disagree. `prod-deps` adds `--production` to drop
`devDependencies`.

The BuildKit cache mount targets `/root/.bun/install/cache`, bun's install
cache. It persists between builds without ending up in an image layer.

Base images are `ARG`s. If bun's musl build ever misbehaves on Alpine, switch
to glibc with `--build-arg NODE_IMAGE=node:24-bookworm-slim`.

## Lockfile

`bun.lock` was produced by running `bun install` while `package-lock.json` was
still present, so bun migrated it and preserved every resolved version. All 47
direct dependencies match the npm tree exactly.

Do not regenerate the lockfile from `package.json` alone. Doing so re-resolves
every `^` range to its newest match, which is a dependency bump wearing a
package-manager change as a disguise. Concretely it moves
`@nestjs-modules/mailer` from 2.0.2 to 2.3.7, whose optional `mjml` dependency
drags `cssnano`, `browserslist`, `caniuse-lite` and `csso` into the runtime
image — CSS minification tooling, in an API.

Bun also installs optional peer dependencies that npm skips, so a fresh
resolution inflates the production tree well beyond the npm baseline. With the
migrated lockfile the production tree is 286M against npm's 301M.

## Image

Alpine is safe here because `package.json` declares no native builds —
`fsevents` is an optional macOS dependency, and the single install script bun
reports as blocked is `@nestjs/core` running `opencollective || exit 0`, a
donation notice. Leave it blocked.

`dev-deps` and `prod-deps` install separately so BuildKit runs them in parallel
and keeps the production dependency layer cached when only `src` changes.

The build stage must stay on `bun run build` (`nest build`). Plain `tsc` would
not copy `src/assets/email_templates/*.html`, and
`src/common/emails/mail.service.ts` reads those templates at runtime from
`dist/assets/email_templates`.

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

MySQL honours `MYSQL_*` only on the first initialisation of the data volume.
Changing `MYSQL_PASSWORD` later has no effect on an existing volume — the old
credentials stay and the API stops authenticating. Change it with `ALTER USER`
inside the container instead.

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

## Startup budget

`depends_on: service_healthy` makes the chain sequential: the api container
does not start until mysql reports healthy.

| Scenario | Serving traffic | Both `healthy` |
|---|---|---|
| Existing volume | ~15–20s | ~40s |
| Fresh volume | ~30–55s | ~60–85s |

The gap between the two columns is healthcheck cadence, not application speed.
MySQL is up in 3–10s but its first check lands at `interval: 10s`; the api
serves in 3–6s but its first check lands at `--interval=30s`.

Treat as abnormal: mysql not healthy by 60s on an existing volume, `unhealthy`
at ~150s (`start_period` plus 12 retries exhausted, after which the api never
starts), or an api container in a restart loop — that last one is credentials
or entities, not slowness.

## Volume

`docker-compose.yml` deliberately declares no `name:` key. The compose project
name is derived from the directory, so the data volume is
`<directory>_mysql_data` — `apicontractmecloud_mysql_data` under
`/var/www/api.contractme.cloud`. Adding a `name:` key renames the volume and
points the API at an empty database.

`docker compose down -v` destroys that volume. Use `docker compose down`.

## Health probing

The mysql healthcheck talks to the server over its unix socket, not over
`-h 127.0.0.1`. A TCP probe makes the server resolve the connecting client's
address, and on a container host that round trip is slow enough to blow past a
5s healthcheck timeout while the probe itself succeeds — the failure looks like
a dead database but the output reads `mysqld is alive`.

`--skip-name-resolve` removes that resolution for every client, including the
api container. It restricts grants to address patterns rather than hostnames,
which is what `MYSQL_USER` already gets from the entrypoint.

The probe verifies that the server answers, not that credentials are valid;
`mysqladmin ping` reports a live server even when authentication is refused.
Wrong credentials surface in the api container's logs instead.

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
docker compose exec api ./node_modules/.bin/typeorm migration:run -d dist/database/data-source.js
docker compose exec api ./node_modules/.bin/typeorm migration:show -d dist/database/data-source.js
```

## Restoring a dump

`./docker/mysql/init` is mounted at `/docker-entrypoint-initdb.d`. Files there
run once, on the first initialisation of an empty volume, so a `.sql` dump
placed in that directory seeds a fresh database. It is ignored once the volume
holds data.
