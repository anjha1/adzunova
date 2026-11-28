# ADR 0001 — Cloudflare R2 & Edge Capabilities

> **Date Read:** 2026-11-28  
> **Official Sources:**
> - R2 Limits: https://developers.cloudflare.com/r2/platform/limits/
> - R2 Presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
> - R2 S3 API Compatibility: https://developers.cloudflare.com/r2/api/s3/api/
> - R2 Pricing & Operations: https://developers.cloudflare.com/r2/pricing/
> - R2 Lifecycle & IA: https://developers.cloudflare.com/r2/buckets/object-lifecycles/
> - R2 Event Notifications: https://developers.cloudflare.com/r2/buckets/event-notifications/
> - R2 Data Security & Encryption: https://developers.cloudflare.com/r2/reference/data-security/
> - R2 Bucket Locks & Jurisdictions: https://developers.cloudflare.com/r2/buckets/bucket-locks/ & https://developers.cloudflare.com/r2/reference/data-location/
> - R2 Public Buckets / `r2.dev` vs Custom Domains: https://developers.cloudflare.com/r2/buckets/public-buckets/
> - Cloudflare WAF Rate Limiting: https://developers.cloudflare.com/waf/rate-limiting-rules/

---

## 1. Capability Matrix

| Capability | Native in R2 | We Must Build | How Verified |
|---|---|---|---|
| **S3 API (`PutObject`, `GetObject`, `HeadObject`, `DeleteObject`, `CopyObject`)** | Yes (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`, region `auto` or `us-east-1` alias) | Typed `ObjectStoragePort` adapter with retries & idempotency keys | Official Docs (2026-11-28); **VERIFIED (2026-11-28)** via `storage-check` on `adzunova-dev-*` |
| **Presigned URLs** | Yes, AWS SigV4; expiry **1s to 7 days** (604,800s); supports signed `Content-Length` | AuthZ check, short TTLs (upload 5–15m, download 60–300s), URL scrubbing, `systemClockOffset` skew sync | Official Docs (2026-11-28); **VERIFIED (2026-11-28)** (`PRESIGN_PUT_STATUS: 200`, `PRESIGN_GET_STATUS: 200`; `ExpiredRequest` 403 observed when local clock lagged +136.8s, fixed via `systemClockOffset`) |
| **Object & Multipart Limits** | Max object **4.995 TiB** (5 TiB - 5 GiB); single `PUT` max **5 GiB**; multipart **5 MiB–5 GiB** per part, up to **10,000 parts** | Client/server part-size planner, strict per-media-type caps (`MAX_*_SIZE_BYTES`) | Official Docs (2026-11-28); **VERIFIED (2026-11-28)** (5 MiB part 1 + 4 B tail part 2 -> `CompleteMultipartUpload` returned composite ETag `...-2`) |
| **Per-Key Write Rate Limit** | **1 concurrent write/sec** to the same object key (HTTP `429` / `TooManyRequests` `10058`) | Immutable UUIDv7/content-addressed keys; never overwrite keys in place | Official Docs (2026-11-28) |
| **Account Bucket Limit** | Default **1,000,000 buckets** per account (unlimited objects/bytes per bucket) | Topology by data class (4 buckets), not per-tenant | Official Docs (2026-11-28) |
| **CORS** | Bucket-level CORS via Dashboard, Wrangler, or `PutBucketCors` | Exact allowlisted origins (`adzunova.tech`), `PUT`/`GET`/`HEAD`, expose `ETag` | Official Docs (2026-11-28); **VERIFIED (2026-11-28)** (`GetBucketCors` 403 with object-only dev token; `OPTIONS` returned 403 until bucket CORS rule is added in Cloudflare Dashboard) |
| **Custom Domains & CDN Cache** | Custom Domains unlock Edge Cache, Tiered Cache, Cache-Control, WAF, Analytics; `r2.dev` is dev-only & heavily rate-limited | Custom domain `cdn.adzunova.tech` on `public-assets`; CI guard banning `r2.dev` | Official Docs (2026-11-28) |
| **WAF & Rate Limiting** | Cloudflare WAF & Rate Limiting rules on Custom Domains (and Workers rate-limiter binding) | Per-IP/route WAF rules on upload/CDN endpoints + app-level per-creator quotas | Official Docs (2026-11-28) |
| **Lifecycle Rules & Infrequent Access (IA)** | Up to **1,000 rules/bucket** (transition to IA or delete, async ~24h; incomplete multipart auto-abort 7d). IA has 30d min duration + $0.01/GB retrieval | Configure quarantine 24h expiry, exports 7d expiry, IA transition for cold archives | Official Docs (2026-11-28) |
| **Event Notifications** | Up to **100 rules/bucket** pushing `object-create` / `object-delete` to **Cloudflare Queues** | Idempotent queue consumer / webhook handler + DLQ + DB reconciliation | Official Docs (2026-11-28) |
| **Bucket Locks & Retention** | Native prefix retention rules (prevent overwrite/delete for duration) | Enable lock rules for immutable audit/invoice artifacts | Official Docs (2026-11-28) |
| **Jurisdictions & Location Hints** | `us` / `eu` strict jurisdictions + best-effort location hints at bucket creation | Choose jurisdiction per regulatory boundary (`IN`/global vs `EU`) | Official Docs (2026-11-28) |
| **Encryption at Rest** | Native **AES-256-GCM** managed by Cloudflare | Never claim customer-managed keys unless explicitly built | Official Docs (2026-11-28) |
| **Workers Bindings** | Native zero-egress binding (`env.BUCKET.get/put`) inside Cloudflare Workers | Optional edge auth/resizing worker in front of `public-assets` / `private-vault` | Official Docs (2026-11-28) |
| **Pricing** | **$0.00 egress**; Standard: **$0.015/GB-mo**, Class A **$4.50/M**, Class B **$0.36/M** (Free tier: 10GB, 1M A, 10M B). IA: **$0.01/GB-mo**, Class A **$9/M**, Class B **$0.90/M**, Retrieval **$0.01/GB** | Integer byte/cost accounting + quota alerts | Official Docs (2026-11-28) |
| **Virus/Malware Scan & Magic-Byte Inspection** | **Not native in R2** | Must build in `ingest-quarantine` processing pipeline (ClamAV / magic-byte parser) | Official Docs (2026-11-28) |

---

## 2. Dev-Bucket Probe Status
- **Verified (2026-11-28)** against `adzunova-dev-public`, `adzunova-dev-private`, `adzunova-dev-quarantine`, and `adzunova-dev-exports`:
  - `HeadBucket` succeeded on all 4 `adzunova-dev-*` buckets.
  - `PutObject`, `HeadObject`, `GetObject`, `DeleteObject`, presigned `PUT` (200 + `ETag` header), presigned `GET` (200), and `CreateMultipartUpload` + 5 MiB part 1 + 4 B part 2 + `CompleteMultipartUpload` (composite ETag `...-2`) + `AbortMultipartUpload` all succeeded.
  - Clock-skew discovery: local Windows clock lagged R2 by `+136,796 ms`, triggering `<Code>ExpiredRequest</Code>` (403) on 120s presigned PUTs until `R2S3Adapter` added `ensureClockSync()` (`systemClockOffset` + `signingDate`).
  - CORS note: `OPTIONS` preflight on `adzunova-dev-quarantine` returned `403` (`Access-Control-Allow-Origin: null`) because the dev bucket CORS policy must be configured in Cloudflare Dashboard to allow `http://localhost:3000` / `https://adzunova.tech` (`PUT`, `GET`, `HEAD`, expose `ETag`).
