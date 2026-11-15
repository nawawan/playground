# AGENT.md

This file describes the backend service for automated agents (CI bots, deployment agents, coding agents).

## Service Summary

Rust HTTP backend for a blog platform. Exposes a REST API on port `8000`.

- **Runtime:** Tokio (multi-threaded)
- **Web framework:** Axum 0.8
- **Database:** PostgreSQL (SQLx, offline mode supported)
- **Cache:** Redis
- **Storage:** Cloudflare R2 (S3-compatible)

## Build

```bash
# Release build
cargo build --release

# Docker image
docker build -t nawawan-backend .
```

The `Dockerfile` is a multi-stage Alpine build. The final image exposes port `8000`.

## Run

```bash
# Local (requires .env file)
cargo run

# Docker Compose (includes PostgreSQL + Redis)
docker compose up
```

## Test

```bash
# All tests (requires DATABASE_URL and REDIS_URL env vars)
cargo test --workspace

# With env vars inline
DATABASE_URL=postgres://user:postgres@localhost:5432/user \
REDIS_URL=localhost REDIS_PORT=6379 \
cargo test --workspace
```

Tests use `mockall` for unit tests and real DB/Redis connections for integration tests.

## Lint / Format

```bash
cargo clippy --workspace -- -D warnings
cargo fmt --all -- --check
```

Both checks run in CI and must pass before merge.

## Testing external APIs (R2 / S3, Cloudflare, etc.)

Do not write code-level tests (unit tests, mocks, in-process stubs) for calls to external APIs such as R2. A mock only proves the code matches our assumption of the API, not that the API behaves that way. Verify them end to end instead: run the real flow against the dev environment (after the PR deploys, e.g. dev.nawawan.com) and check the actual result.

- Keep the logic around the external call (EXIF parsing, position calculation, key naming, ...) in pure functions and unit test those.
- Test the database layer against a real database (`#[sqlx::test]`).
- Never point local tests or experiments at a real production bucket / database.

## Health Endpoints

| Endpoint | Healthy response |
|---|---|
| `GET /health` | `200 OK` |
| `GET /health/db` | `200 OK` (verifies DB connectivity) |

## Required Environment Variables

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
REDIS_HOST=<host>
REDIS_PORT=<port>
PASSWORD_PEPPER=<secret>
CLOUDFLARE_ACCOUNT_ID=<id>
CLOUDFLARE_ACCESS_KEY_ID=<key>
CLOUDFLARE_SECRET_ACCESS_KEY=<secret>
PAGE_HOST=<blog_host>
BLOG_PAGE=<blog_url>
SQLX_OFFLINE=true   # set when running without live DB for compile/check
```

## Migrations

Migrations are SQL files in `src/migrations/`. Run before starting the server:

```bash
sqlx migrate run --source src/migrations
```

## Crate Layout

| Crate | Role |
|---|---|
| `handler` | Axum routes, extractors, request/response DTOs |
| `usecase` | Business logic, domain models, repository trait definitions |
| `storage` | PostgreSQL, Redis, and S3 repository implementations |
| `shared` | Config structs |

Agents modifying business logic should focus on `usecase/`; database changes go in `storage/` and `src/migrations/`.
