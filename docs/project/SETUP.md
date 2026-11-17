# Local Setup

## Requirements
- Node.js 22 LTS (recommended; see `.nvmrc`). Node 20+ supported. Node 24 is supported via `pnpm run dev`.
- pnpm 10+
- Docker Desktop / Docker Engine (optional for local mock/in-memory dev)
- Git

## Initialise workspace
```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install
```

## Running Development Environment
To start the entire Adzunova stack (`identity-service` on `:4101` and Next.js `web` on `:3000`):

```bash
pnpm run dev
# or:
pnpm dev
```

This invokes the automated preflight (`scripts/predev.mjs`) and orchestrator (`scripts/dev-all.mjs`), which handles health gating and process-tree management.

> **Note on Turborepo**: `pnpm dev:turbo` runs legacy `turbo run dev`. On Windows with Node 24+, Turborepo's child process spawning hits CVE-2024-27980 mitigations and throws `spawn UNKNOWN`. Always prefer `pnpm run dev`.

## Diagnostics & Verification
- Check your environment and port status:
  ```bash
  pnpm doctor
  ```
- Run automated end-to-end integration and auth checks:
  ```bash
  pnpm verify:auth
  ```
