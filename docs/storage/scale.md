# Adzunova Storage Scale Ladder & Capacity Math (S0)

## 1. Scale Ladder (L0 → L3)

| Stage | Architecture | Target Scale |
|---|---|---|
| **L0 (Launch)** | Single Next.js web instance + MongoDB (Atlas M10+ for prod; local single-node `rs0` for dev) + R2 (`ingest-quarantine` -> `public-assets`/`private-vault`) | Up to ~100K users |
| **L1 (Growth)** | MongoDB Atlas M10+ replica set (primary writes/auth-critical reads; `secondaryPreferred` for non-critical catalog reads), Redis (rate limits, upload session state), dedicated media/scan worker pool | 100K – 10M users |
| **L2 (Scale)** | Sharded MongoDB cluster (hashed/compound `tenantId` shard keys), Cloudflare Queues event bus, sharded counters for hot metrics, separate analytics store | 10M – 100M users |
| **L3 (Global)** | Cell-based multi-region deployment, zone-sharded MongoDB by region/tenant, R2 jurisdictional buckets (`us`, `eu`, global) | 100M – 1B+ users |

---

## 2. Capacity Math Template (Explicit Assumptions)

**Per-User Storage & Traffic Assumptions:**
- Average objects per active user: **12 objects** (1 avatar, 1 cover/logo, 6 portfolio/deliverable assets, 4 documents/exports)
- Average stored size per user (including thumbnails/variants): **25 MB** (`0.025 GB`)
- Monthly write operations (Class A: `CreateMultipartUpload`, `PutObject`, `CompleteMultipartUpload`, `CopyObject`): **8 ops/user/month**
- Monthly read operations (Class B: `GetObject`/`HeadObject` via R2 origin; **90% CDN cache hit rate** on `public-assets` reduces origin Class B by 10×): **40 origin Class B ops/user/month** (400 total CDN requests/user/month)
- R2 Standard Pricing (from Cloudflare docs 2026-11-28): Storage **$0.015/GB-mo**, Class A **$4.50/M**, Class B **$0.36/M**, Egress **$0.00**.

| Metric | 1M Users | 100M Users | 1B Users |
|---|---|---|---|
| **Total Objects** | `12,000,000` (12M) | `1,200,000,000` (1.2B) | `12,000,000,000` (12B) |
| **Total Stored Bytes** | `25 TB` (`25,000 GB`) | `2.5 PB` (`2,500,000 GB`) | `25 PB` (`25,000,000 GB`) |
| **Class A Ops / sec (avg)** | `~3.1 ops/s` (8M/mo) | `~309 ops/s` (800M/mo) | `~3,086 ops/s` (8B/mo) |
| **Class B Origin Ops / sec (avg)** | `~15.4 ops/s` (40M/mo) | `~1,543 ops/s` (4B/mo) | `~15,432 ops/s` (40B/mo) |
| **Storage Cost / mo** | `$375.00` | `$37,500.00` | `$375,000.00` |
| **Class A Cost / mo** | `$36.00` | `$3,600.00` | `$36,000.00` |
| **Class B Cost / mo** | `$14.40` | `$1,440.00` | `$14,400.00` |
| **Egress Cost / mo** | **$0.00** | **$0.00** | **$0.00** |
| **Total R2 Cost / mo** | **~$425.40 / mo** | **~$42,540 / mo** | **~$425,400 / mo** |
| **Cost per 1M Objects / mo** | **~$35.45** | **~$35.45** | **~$35.45** |

> *Note:* Moving cold `private-vault` documents (>90 days) to **Infrequent Access ($0.01/GB-mo)** reduces resting storage cost by 33% on cold bytes.

---

## 3. MongoDB Metadata Scaling Plan (ADR 0003)

### Cluster & Read Preference Policy
- **Production Minimum:** MongoDB Atlas **M10+** dedicated replica set (never M0 in production; M0 has a hard 512 MB limit and shared IOPS).
- **Read Preference Tradeoff:**
  - `primary` (mandatory): upload-session creation/completion, presigned GET authorization, idempotency-key deduplication, blob `refCount` updates, and `storage_asset_events` hash-chain appends.
  - `secondaryPreferred` (allowed): public creator portfolio/media-kit catalog reads and non-critical analytics summaries where bounded replication lag (<1–2s) is acceptable.

### Shard Key Plan (L2 / L3)
- `storage_media_assets`, `storage_asset_versions`, `storage_asset_events`, `storage_asset_links`: compound shard key `{ tenantId: 1, _id: 1 }` (or hashed `tenantId` at L3) to co-locate tenant queries on a single shard and avoid scatter-gather.
- `storage_asset_blobs`: `{ bucket: 1, contentHash: 1 }` for uniform content-addressed distribution across shards.
- **Sharded Counters (L2+):** Hot tenant usage bytes and high-fanout blob metrics use N-bucketed counter sub-documents (`shard_0..shard_15`) aggregated asynchronously rather than single-document `$inc` hotspots.

### Working-Set & Index-Size Math (100M / 1B Assets)
Assumptions: avg `storage_media_assets` doc ~550 B, avg `storage_asset_versions` doc ~450 B, avg `storage_asset_blobs` doc ~400 B; ~4 indexes per collection (~180 B/entry).
| Scale | Metadata Raw Size | Index Working Set | Recommended RAM (WiredTiger Cache) |
|---|---|---|---|
| **100M Assets** | ~140 GB | ~72 GB (hot index subset ~18 GB) | 32–64 GB RAM per shard (M40/M50) |
| **1B Assets** | ~1.4 TB | ~720 GB (hot index subset ~180 GB) | 10-shard cluster × 32 GB RAM/shard |

### Connection-Count Budget
- Serverless / Render Web & Worker instances configure `maxPoolSize=10`, `minPoolSize=1`, `maxIdleTimeMS=30000`, `serverSelectionTimeoutMS=5000`, `socketTimeoutMS=15000`.
- With 20 web/worker instances × `maxPoolSize=10` = **200 max connections** (well within Atlas M10's 1,500 connection limit and M30's 3,000 limit).

