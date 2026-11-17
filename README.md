# 🚀 Adzunova

> **Global Creator-Commerce Infrastructure Platform**  
> Domain-driven microservices architecture connecting verified creators and brands for deal execution, deliverable tracking, and escrow-backed payouts.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Monorepo Structure](#-monorepo-structure)
- [Tech Stack](#-tech-stack)
- [Dual-Portal Model](#-dual-portal-model)
- [Authentication & Identity System](#-authentication--identity-system)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Running Locally](#running-locally)
- [Developer Tooling](#-developer-tooling)
- [Available Scripts](#-available-scripts)
- [Design System](#-design-system)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

Adzunova replaces ad-hoc DM sponsorships with an end-to-end deal infrastructure:

- **Verified Matchmaking** — Cross-platform creator roster (YouTube, Instagram, TikTok, Podcasts, UGC).
- **Milestone-based Escrow** — Funds held until brand formally accepts deliverables.
- **Role-separated Portals** — Creators and brands each have an isolated, dedicated dashboard.

---

## 🏛️ Monorepo Structure

```
Adzunova/
├── apps/
│   ├── web/                      # Next.js 16 (App Router, Turbopack, React 19)
│   │   ├── src/app/              # Pages and API route handlers
│   │   │   ├── (marketing)/      # Public marketing + auth pages (/auth/*)
│   │   │   ├── creator/          # Protected creator portal (/creator/dashboard)
│   │   │   ├── brand/            # Protected brand portal (/brand/dashboard)
│   │   │   └── api/auth/         # OAuth entry and callback route handlers
│   │   ├── src/middleware.ts     # Next.js middleware: session guard & role-based redirects
│   │   └── src/lib/
│   │       ├── identity-client.ts # Server-side HTTP client for identity-service
│   │       └── request-id.ts     # Correlation ID generator
│   └── admin/                    # Internal admin portal (scaffold)
├── services/
│   └── identity-service/         # Auth microservice (Express, TypeScript, port :4101)
│       ├── src/main.ts           # App entry: health endpoints registered FIRST, then middleware
│       ├── src/config.ts         # Zod-based env schema validation; fails fast on bad config
│       ├── src/application/      # Domain use cases: register, login, OAuth, OTP, session
│       └── src/infrastructure/
│           └── persistence/
│               ├── database.ts   # MongoDB client + background connect; getDatabase() waits for ready
│               └── in-memory-db.ts # Fallback in-memory store (dev only)
├── libs/ui/                      # Shared UI component library
├── scripts/
│   ├── dev-all.mjs               # Stack orchestrator (use this, not turbo, on Node 24)
│   ├── predev.mjs                # Pre-dev preflight: Node version, env vars (masked), ports
│   ├── doctor.mjs                # Diagnostic report: env files, variables, ports, /health
│   └── verify-auth.mjs           # Integration checks: /health burst, DB mode, OAuth redirect
└── docs/                         # Architecture Decision Records and design notes
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | [Next.js 16](https://nextjs.org/) — App Router, Turbopack, React 19 |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first `@theme`, no `tailwind.config.ts` |
| **Identity service** | Express 5 on Node.js, TypeScript, Zod schema validation |
| **Database** | MongoDB via the Node.js driver; in-memory fallback for local dev |
| **Monorepo** | [pnpm v10](https://pnpm.io/) workspaces + [Turborepo v2](https://turbo.build/) |
| **Session auth** | JSON Web Tokens (HS256), compound cookie format, middleware-based role guard |

> **Google OAuth**: The identity-service initiates the OAuth flow by building the Google authorization URL server-side. The token exchange happens in the `/api/auth/callback/google` route handler. Standard OAuth 2.0 — not PKCE (the web app is a confidential server-side client).

---

## 👥 Dual-Portal Model

| | Creator (`/creator/*`) | Brand (`/brand/*`) |
|:---|:---|:---|
| Sign-in | `/auth/creator/sign-in` | `/auth/brand/sign-in` |
| Sign-up | `/auth/creator/sign-up` | `/auth/brand/sign-up` |
| Dashboard | `/creator/dashboard` | `/brand/dashboard` |
| Onboarding | `/creator/onboarding` | `/brand/onboarding` |
| Session role | `CREATOR` | `BRAND` |

Middleware in `src/middleware.ts` decodes the session cookie's JWT payload (without calling any external service) and enforces role-based redirects at the edge.

---

## 🔐 Authentication & Identity System

1. **OAuth initiation** — `GET /api/auth/google?role=CREATOR|BRAND` calls `identity-service /api/v1/auth/oauth/google/init`, which returns a Google authorization URL.
2. **Resilient HTTP client** (`src/lib/identity-client.ts`):
   - 5-second timeout via `AbortController`.
   - One retry with 300 ms backoff on idempotent (GET) failures.
   - Structured error codes: `IDENTITY_UNREACHABLE`, `IDENTITY_TIMEOUT`, `IDENTITY_BAD_RESPONSE`, `IDENTITY_CLIENT_ERROR`.
   - `x-request-id` header forwarded to identity-service for log correlation. **Never leaks secrets or stack traces to the browser.**
3. **Session tokens** — HS256 JWTs signed by identity-service. Stored as `adzunova_session` cookie (httpOnly, sameSite=lax). The middleware reads the payload bytes directly from the cookie without network round-trips.
4. **Dev database fallback** — When MongoDB is unreachable at startup, identity-service falls back to an in-memory store. **Data is volatile**: it is lost on each restart. Only allowed in `NODE_ENV=development`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22 LTS (recommended) — see `.nvmrc`. Node 20 also works.
  - Node 24 works with `pnpm run dev` but **not** with `pnpm dev:turbo` (see [Troubleshooting](#troubleshooting)).
- **pnpm** ≥ 10.0.0 — `corepack enable && corepack prepare pnpm@10.0.0 --activate`

### Environment Configuration

```bash
cp .env.example .env
# Edit .env: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SESSION_SECRET
# MONGODB_URI is optional locally (falls back to in-memory store)
```

Then create the web app env file:

```bash
# apps/web/.env.local is read by Next.js at startup
# IDENTITY_SERVICE_URL defaults to http://127.0.0.1:4101 — only override if needed
```

Minimum required variables in root `.env`:

| Variable | Required | Note |
|:---|:---|:---|
| `GOOGLE_CLIENT_ID` | **Yes** | Google Cloud Console OAuth credential |
| `GOOGLE_CLIENT_SECRET` | **Yes** | Google Cloud Console OAuth credential |
| `AUTH_SESSION_SECRET` | **Yes** | ≥32 chars; signs all session JWTs |
| `MONGODB_URI` | No (dev) | Falls back to in-memory store if absent |
| `IDENTITY_SERVICE_URL` | No | Defaults to `http://127.0.0.1:4101` |

### Running Locally

```bash
pnpm run dev
```

This command:
1. Runs `predev` preflight — checks Node version (warns, does not block on 24), env vars (masked), and port availability.
2. Launches `identity-service` on `:4101` via `node tsx/dist/cli.mjs watch src/main.ts`.
3. Polls `http://127.0.0.1:4101/health` with exponential backoff (up to 90 s).
4. Launches the Next.js web app on `:3000` only after health is confirmed.
5. Prints a URL table with DB mode from `/health/ready`.

**Running URLs once started:**

| Service | URL |
|:---|:---|
| Web app | http://localhost:3000 |
| Creator sign-in | http://localhost:3000/auth/creator/sign-in |
| Brand sign-in | http://localhost:3000/auth/brand/sign-in |
| Identity liveness | http://127.0.0.1:4101/health |
| Identity readiness | http://127.0.0.1:4101/health/ready |

---

## 🩺 Developer Tooling

### `pnpm doctor`
Prints a diagnostic table: Node version, env file presence, masked variable values, port occupancy, and live HTTP health probes. Run this before `pnpm run dev` if something seems wrong.

### `pnpm verify:auth`
Integration check suite (requires both services running):
- 20-request burst to `/health` — verifies sub-300 ms latency.
- `/health/ready` — verifies DB mode (`mongo` or `in-memory-fallback`).
- `GET :3000/api/auth/google?role=CREATOR` — verifies 302/307 redirect to `accounts.google.com` with correct `client_id` and `redirect_uri`.

### `pnpm dev:all`
Alias for `pnpm run dev` — same script, kept for backwards compatibility.

### `pnpm dev:turbo`
Runs `turbo run dev` — the original Turborepo pipeline. **Crashes with `spawn UNKNOWN` on Node 24.x on Windows.** Kept as an opt-in alternative; do not use as the default on Windows.

---

## 📜 Available Scripts

| Command | What it does |
|:---|:---|
| `pnpm run dev` | **Recommended**: Preflight + start identity-service + Next.js, with health gating |
| `pnpm dev:all` | Same as `pnpm run dev` (alias) |
| `pnpm dev:turbo` | `turbo run dev` — crashes on Node 24 + Windows (see Troubleshooting) |
| `pnpm doctor` | Environment diagnostic report (env files, masked vars, ports, /health) |
| `pnpm verify:auth` | Integration checks: burst /health, DB mode, OAuth redirect |
| `pnpm build` | Turborepo build pipeline |
| `pnpm typecheck` | `tsc --noEmit` across all packages |
| `pnpm lint` | ESLint across all packages |
| `pnpm test` | Vitest unit tests |

---

## 🎨 Design System

Tailwind CSS v4 with a CSS-first token system in `apps/web/src/app/globals.css`.

**Critical rule**: All HTML element resets (`button`, `a`, `body`) are inside `@layer base { ... }`. CSS Cascade Layers mean unlayered rules beat every layered utility — placing `button { background: none }` outside `@layer` would strip backgrounds from all gradient buttons.

The `@theme` block exposes `--color-brand-*` (indigo-violet) and `--color-accent-*` (amber) color scales as Tailwind utilities (`bg-brand-600`, `from-indigo-600`, etc.).

---

## ❓ Troubleshooting

### `spawn UNKNOWN` or `spawn EINVAL` with `pnpm dev:turbo`

**Root cause**: Node 22.4+ (and 20.15+) added CVE-2024-27980 mitigations that break spawning `.cmd`/`.bat` shims without `shell: true`. Turbo on Windows resolves workspace `dev` scripts through pnpm `.cmd` shims and calls `spawn` without `shell: true`. This throws `spawn UNKNOWN`/`EINVAL` on Node 24.

**Fix**: Use `pnpm run dev` (the default). It runs `node scripts/dev-all.mjs`, which invokes `node tsx/dist/cli.mjs` and `node next/dist/bin/next` directly — no `.cmd` shims, no shell needed.

```powershell
# Wrong on Node 24 + Windows:
pnpm dev:turbo   # → spawn UNKNOWN

# Correct:
pnpm run dev     # → works on Node 20 / 22 / 24
```

### Port 3000 or 4101 already in use

```powershell
# 1. Find the PID
Get-NetTCPConnection -LocalPort 3000,4101 -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess

# 2. Kill it (replace 12345 with the actual PID)
taskkill /PID 12345 /F
```

Or run `pnpm doctor` — it shows the PID in the Port Listeners row.

### MongoDB bad auth / connection timeout

In `NODE_ENV=development`, identity-service automatically falls back to an in-memory store. **All data is lost on restart.** This is intentional for local development without a MongoDB instance. Set `MONGODB_URI` in root `.env` to persist data.

### Google sign-in says "already linked to a BRAND profile"

You previously signed in as a BRAND with that Google account. Navigate to `/auth/brand/sign-in` instead. The error page on the creator sign-in shows a direct **"Switch to Brand Sign In"** button.

---

<p align="center"><em>Adzunova Infrastructure Engineering</em></p>
