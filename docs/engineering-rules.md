# Adzunova Platform Engineering Rules

> **Scope:** Binding platform-wide engineering rules for Adzunova (Next.js 16, MongoDB + Prisma, Cloudflare R2, Payments & Storage).

---

## 1. TRUTH
- **Zero fake, mock, or demo data** in user-facing UI or production code paths.
- **No default literals** for missing business data: missing = `null` = `"Not provided"` / `"Not available: <reason>"` / `"Not configured"`.
- **No Unproven Claims:** Never display strings like `"escrow protected"`, `"secure"`, `"verified"`, `"encrypted"`, or `"virus-free"` in UI copy unless the underlying feature is implemented and proven by automated tests.
  - Until Razorpay Route hold (or RBI-authorized escrow) is confirmed and tested, UI must state `"Payment received; work can start"` rather than `"escrow protected"`.

## 2. PROOF
- Nothing is marked done without real command output on the final committed code:
  - `pnpm verify` (`next build`, `tsc --noEmit`, `node scripts/ci-guards.mjs`, unit, contract, integration against real local MongoDB replica set `rs0`, and security tests)
  - Playwright E2E against `next build && next start`
- Never write `"verified"` for anything not run on the final code.

## 3. DOCS OVER GUESSING
- Read the current official documentation of every external provider (Cloudflare R2, Razorpay Orders/Webhooks/Refunds/Route/RazorpayX, KYC/e-sign providers, ClamAV) before building against it.
- Probe in **test mode only**, store scrubbed fixtures, and write an ADR citing doc URLs and date read.
- Never invent endpoints, limits, headers, error codes, or fees. If a capability requires provider activation, report it; never mock it in production paths.

## 4. MONEY & LEDGER INTEGRITY
- All monetary values stored and computed in **integer paise** (`BigInt` in Prisma / BSON `Int64` in MongoDB, serialized as decimal strings in JSON DTOs). **No floating-point math**.
- Percentages stored in **basis points** (`bps`, e.g. `500` = `5.00%`, `1800` = `18.00%`).
- Single rounding rule (**round half up**) in `@adzunova/money`, applied per line item server-side. Never trust client-calculated totals.
- Immutable **double-entry ledger**: every money movement is a balanced journal entry (`sum(debit) === sum(credit)`). Never mutate balances directly.
- Snapshot `feeConfigVersion` and `rateCardItemVersion` on every booking at creation time.
- **Idempotency keys** required on every money-moving API call and webhook handler.
- **Maker-checker** required for all manual admin money movements (refunds, releases, adjustments).

## 5. SECURITY & PRIVACY
- Secrets (`R2_*`, `RAZORPAY_*`, `AUTH_SESSION_SECRET`, KYC/payout tokens, webhook secrets) are **server-only** and scrubbed from all logs, error payloads, and Problem Details responses.
- **Fail closed** on missing auth, missing ownership, missing config, or invalid webhook signatures.
- Verify webhooks over **raw request body** using constant-time comparison with replay protection.
- **Live-key guard:** Refuse `rzp_live_` keys unless `RAZORPAY_MODE=live` AND an audited owner-approval record exists.
- Never put PII (emails, phone numbers, PAN, bank accounts) in object keys, logs, or metric labels. Mask PAN/bank details in UI.

## 6. SCALE & ARCHITECTURE
- Ports and adapters for external providers (`ObjectStoragePort`, `PaymentGatewayPort`, `PayoutPort`, `KycPort`, `QueuePort`, `RateLimitPort`).
- MongoDB + Prisma with separate database per bounded context (`adzunova_storage`, `adzunova_payments`); never touch `identity-service` schema.
- Transactional outbox + idempotent consumers + DLQ + replay; atomic `findOneAndUpdate` leases for queues/timers when `REDIS_URL` is absent.
- Cursor pagination only; no unbounded queries.

## 7. UI & DESIGN
- Responsive layout: mobile (`<= 640px`) bottom navigation, desktop (`>= 641px`) sidebar.
- Semantic design tokens only; WCAG AA contrast compliance.
- One milestone at a time; no scope creep; document every deviation.

