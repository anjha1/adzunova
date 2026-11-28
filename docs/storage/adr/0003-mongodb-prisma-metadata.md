# ADR 0003 — Storage Metadata Persistence: MongoDB + Prisma ORM

> **Date:** 2026-11-28  
> **Prisma Version:** `6.19.3` (matching `services/identity-service/package.json`)  
> **Official Docs:** https://www.prisma.io/docs/orm/overview/databases/mongodb

---

## 1. Decision
Storage metadata (`media_assets`, `asset_versions`, `asset_blobs`, `asset_links`, `asset_events`, `upload_sessions`) is persisted in **MongoDB** via a dedicated workspace package **`packages/storage-db`** using **Prisma 6.19.3** (plus raw MongoDB driver commands for capabilities Prisma does not model). `services/identity-service/prisma/schema.prisma` is left **untouched**.

---

## 2. Why This Decision
- Production already runs on MongoDB (`MONGODB_URI`) without a provisioned PostgreSQL cluster.
- Using a separate `packages/storage-db` package with its own generated Prisma client (`packages/storage-db/generated/client`) and `storage_` collection prefix (`@@map`) isolates storage metadata from identity-service while sharing the Atlas cluster (or targeting `STORAGE_MONGODB_DB_NAME` later).

---

## 3. Honest Limitations vs. Relational (PostgreSQL) & How We Mitigate Each

| Limitation in MongoDB / Prisma 6.19.3 | Mitigation in `packages/storage-db` |
|---|---|
| **No `prisma migrate` for MongoDB** (only `prisma db push`) | Versioned migration runner (`storage_schema_migrations` collection with SHA-256 checksums, `up`/`down` scripts, dry-run mode) + controlled release-step `db push`. |
| **No TTL, partial, or collation-specific indexes in Prisma schema** | Idempotent `index-bootstrap.mjs` using raw `createIndexes` with `up`, `down`, and `verify` modes (run as an explicit release step, never at app boot). |
| **No database-level `CHECK` constraints or triggers** | Repository layer enforces invariants: conditional atomic `$inc` with `refCount: { $gt: 0 }` (never `< 0`), append-only repositories exposing `insert`/`find` only (no update/delete), plus periodic refCount reconciliation job. |
| **No declarative time partitioning** | TTL index on `upload_sessions.expiresAt` (`expireAfterSeconds: 0`) for automatic expiry; time-bucketed collections planned for `download_audit` in S6. |
| **16 MB document size limit** | Zero unbounded arrays inside documents (`asset_links` and `asset_events` are separate collections). |
| **Transactions require a Replica Set** | Local dev runs `mongod --replSet rs0` via `scripts/dev/windows/mongo-start.ps1`; Atlas production is a replica set. Transactions used **only** for atomic multi-document state transitions (`createAssetVersionAndIncrementBlob`, `unlinkAndDecrementBlob`), keeping normal reads/writes single-document & idempotent. |
