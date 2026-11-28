# ADR 0001: BigInt / BSON Int64 Money Handling

**Date:** 2026-11-28
**Status:** Accepted

## Context
Monetary values in Adzunova must be stored and calculated in integer paise (minor units) with zero floating-point drift. Prisma on MongoDB maps `BigInt` fields to BSON `Int64` (`Long`). However, Node.js `JSON.stringify()` throws `TypeError: Do not know how to serialize a BigInt` when returning Prisma `BigInt` values in HTTP responses or storing them in JSON payloads.

## Decision
1. All monetary fields in `packages/payments-db/prisma/schema.prisma` use `BigInt` (paise).
2. Percentages and tax rates use `Int` basis points (`bps`, e.g., `500` = `5.00%`, `1800` = `18.00%`).
3. `@adzunova/money` provides `serializeMoney(amountPaise: bigint): string` and `parseMoney(value: string | number | bigint): bigint` helpers.
4. All API DTOs and outbox event payloads serialize `BigInt` amounts as decimal strings (e.g., `"3717000"` for ₹37,170.00) and never raw `number` floats.
5. Rounding uses **round half up** on `BigInt` arithmetic (`(numerator * 2n + denominator) / (2n * denominator)` for positive values) inside `@adzunova/money`.

## Consequences
- Zero IEEE-754 rounding errors across fee splits, GST, TDS, and ledger balances.
- Safe JSON serialization across Next.js route handlers, outbox events, and MongoDB drivers.

