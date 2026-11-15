# Local Setup

## Requirements
- Node.js 22+
- pnpm 10+
- Python 3.11+
- Docker Desktop / Docker Engine
- Git

## Initialise workspace
```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install
```

## Initialise Next.js apps
Run create-next-app in `apps/web` and `apps/admin`, then set package names to
`@adzunova/web` and `@adzunova/admin`.

## Start infrastructure
```bash
docker compose -f infra/local/docker-compose.yml up -d postgres ledger-postgres redis
docker compose -f infra/local/docker-compose.yml --profile full up -d
```

Generated service files are scaffolds. Implement domain use cases, persistence,
Kafka producers/consumers, real readiness checks and production security before deploy.
