# ADR 0002: MongoDB Double-Entry Ledger Design

**Date:** 2026-11-28
**Status:** Accepted

## Context
Adzunova uses MongoDB (replica set `rs0`) + Prisma without PostgreSQL. The payment system requires an immutable double-entry escrow ledger where every rupee is accounted for (`sum(debit) === sum(credit)`), balances are never mutated directly without a journal entry, and concurrent operations cannot double-spend or double-credit.

## Decision
1. **Isolated Database & Collections:** Use a dedicated MongoDB database (`adzunova_payments` via `PAYMENTS_MONGODB_DB_NAME`) with `pay_` collection prefixes (`pay_ledger_accounts`, `pay_ledger_entries`, `pay_ledger_lines`, `pay_idempotency`, `pay_outbox_events`, `pay_consumed_events`, `pay_dlq_events`, `pay_audit_events`).
2. **Chart of Accounts (Phase 1):**
   - `BRAND_PAYMENT_CLEARING`
   - `ESCROW_HELD`
   - `PLATFORM_REVENUE`
   - `GST_PAYABLE`
   - `TDS_PAYABLE`
   - `CREATOR_PAYABLE`
   - `CREATOR_WALLET`
   - `REFUND_PAYABLE`
   - `DISPUTE_FROZEN`
3. **Balanced Journal Transactions:** Every posting executes inside a MongoDB replica-set multi-document ACID transaction (`session.withTransaction`):
   - Validates `sum(debits) === sum(credits)` and `lines.length >= 2` in integer paise (`BigInt`).
   - Enforces a unique index on `idempotencyKey` in `pay_ledger_entries`.
   - Appends immutable `pay_ledger_lines` referencing `entryId`, `accountId`, `direction` (`DEBIT` | `CREDIT`), and `amountPaise`.
   - Updates `pay_ledger_accounts.balancePaise` atomically inside the same transaction.
4. **Reconciliation:** Daily job compares gateway settlement reports against `pay_ledger_lines` totals and raises alerts on mismatch.

## Consequences
- Requires MongoDB replica set (`rs0` locally via `scripts/dev/windows/mongo-start.ps1`, Atlas/managed replica set in production).
- Provides strict ACID invariants and auditability on MongoDB without introducing a second database engine.

