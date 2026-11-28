# Adzunova Payments & Storage Scale Architecture (v1)

## Design Target
- **Phase 1 Shipping Tier (L0/L1):** Single-region Next.js 16 + MongoDB Replica Set (`rs0` / Atlas) + Cloudflare R2 + in-process / standalone Node worker.
- **Scale Target (L2/L3 Seams):** Millions of creators/brands, high-concurrency webhook bursts, partitioned ledger & outbox processing.

## Database Isolation & Hot Paths
- **Isolated Databases:** `adzunova_payments` (`pay_*` collections) is strictly isolated from `adzunova_storage` (`storage_*`) and `identity-service`.
- **ESR-Ordered Indexes:** Every hot query (`pay_outbox_events`, `pay_queue_jobs`, `pay_audit_events`) uses Equality-Sort-Range indexes and TTL auto-cleanup (`pay_idempotency`, `pay_rate_limit_buckets`).
- **Cursor Pagination:** All list APIs (bookings, ledger lines, audit logs, DLQ) use keyset/cursor pagination; unbounded `.find().toArray()` is forbidden.

## Queue, Timers & Rate Limits (Redis-Optional Seam)
- **L0/L1 (No Redis):** `QueuePort` (`MongoQueueAdapter`) and `RateLimitPort` (`MongoRateLimitAdapter`) use atomic `findOneAndUpdate` leases (`lockedUntil`) and TTL window counters on MongoDB.
- **L2/L3 (With `REDIS_URL`):** Swap `QueuePort` / `RateLimitPort` adapters to BullMQ / Redis Lua sliding windows without changing any domain service.

## Capacity Math (Phase 1 L0/L1 Baseline)
- **Booking Lifecycle:** ~10–15 state transitions & audit events per booking, ~4–6 ledger lines per booking (~2 KB/booking).
- **100,000 bookings/month:** ~200 MB ledger/audit data/month, ~1.5M ops/month (< 1 write/sec avg, ~50 writes/sec burst) — well within a single MongoDB M10/M30 replica set.
- **Outbox & Worker:** 30s lease window prevents split-brain double execution; exponential backoff up to 5 attempts before moving to `pay_dlq_events`.
