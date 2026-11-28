# Adzunova Storage Engineering Rules (Series S0–S12)

> **Scope:** Storage-specific engineering rules governing all phases S0 through S12. (No root `docs/engineering-rules.md` exists; this document serves as the canonical contract for the storage series.)

---

## 1. TRUTH
- **Zero fake, mock, or demo data** in user-facing UI or production code paths.
- **Unconfigured = Honest UI:** Missing storage env vars or disabled feature flags must surface `'Storage not configured'` cleanly — never crash, never silently skip, and never fake success.
- **No Unproven Security Claims:** Never display strings like `'secure'`, `'encrypted'`, or `'virus-free'` in UI copy unless the underlying feature is implemented and proven by automated tests.

## 2. PROOF
- Nothing is marked done without real command output from:
  - `next build` + `next start`
  - `tsc --noEmit`
  - `eslint`
  - CI guards (`node scripts/ci-guards.mjs`)
  - Unit, contract, integration, security, and Playwright tests
- A single verify script (`pnpm run verify`) runs all checks.

## 3. DOCS OVER GUESSING
- Read the current official **Cloudflare R2**, **CDN/Cache**, **WAF**, **Workers**, and **Queues** documentation before each phase.
- Probe real behavior against **dev buckets only**; store scrubbed fixtures; write an ADR citing doc URLs and the date read.
- Never invent limits, endpoints, headers, error codes, or prices.

## 4. SECURITY
- Secrets (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, presigned URLs, signed tokens, webhook secrets) are **server-only** and scrubbed from all logs and error responses.
- **Fail closed** on missing auth, missing ownership, or missing config.
- Enforce authorization on every private object access; **never put PII** (emails, names, PAN/GST, phone numbers) in object keys, logs, or metric labels.

## 5. SCALE
- Stateless services using ports and adapters.
- Immutable object keys (content-addressed or UUIDv7); never overwrite in place (respect R2's 1 write/sec per-key limit).
- No unbounded queries; cursor pagination only; partitioned append-only tables; idempotency keys; outbox + idempotent consumers with DLQ and replay; backpressure; documented capacity math per phase.
- **Design target:** millions to billions of users.

## 6. WORK PROTOCOL
- One phase at a time; no scope creep; list every deviation; ask only blocking questions; stop after the report.
- **Never touch production data or production buckets (`public-assets`, `private-vault`); use dev buckets and test tooling only.**
