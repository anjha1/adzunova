# Storage Architecture (Phase S1)

## Overview
Adzunova's storage core provides a single, stateless, port-and-adapter abstraction (`ObjectStoragePort` -> `R2S3Adapter`) backed by **Cloudflare R2** for object bytes and **MongoDB + Prisma (`@adzunova/storage-db`)** for durable metadata, versioning, deduplication, and append-only audit events.

## Component Topology
1. **Object Storage Port (`apps/web/src/lib/storage/port.ts`)**
   - Operations: `head`, `get` (streaming), `put` (streaming), `copy`, `delete`, `deleteMany` (batched at `R2_DELETE_MANY_BATCH_LIMIT = 1000`), `presignPut`, `presignGet`, `createMultipart`, `presignPart`, `completeMultipart`, `abortMultipart`, `listParts`, and `list(prefix, cursor)` (admin/reconciliation only; forbidden on request paths via CI guard).
   - **Per-Role Credential Isolation:** Each `StorageRole` (`upload_signer`, `processor`, `reader`, `admin_lifecycle`) binds to its own R2 API token pair (`R2_<ROLE>_ACCESS_KEY_ID`, `R2_<ROLE>_SECRET_ACCESS_KEY`) and enforces `ROLE_ALLOWED_OPERATIONS` in-process before any SDK call (`RoleViolationError` on violation).
   - **Credential Rotation:** `rotateCredentials(role, nextCreds)` swaps the underlying `S3Client` atomically without process restart.
   - **Resilience (`apps/web/src/lib/storage/resilience.ts`):** Bounded timeouts, exponential backoff with `crypto.randomInt` full jitter on retryable 429/500/503/network faults, and a per-role circuit breaker.

2. **Immutable Key Scheme (`apps/web/src/lib/storage/keys.ts`)**
   - Enforces `MAX_R2_KEY_BYTES = 1024`, rejects PII, path traversal (`..`), and control characters.
   - Shard prefix: `computeTenantShard(tenantId)` (4-char SHA-256 hex) prevents R2/S3 lexicographical hot-spotting.
   - Public keys: `pub/{shard}/{tenantId}/{dataClass}/{assetId}/v{version}/{contentHash}.{ext}`
   - Private keys: `priv/{shard}/{tenantId}/{dataClass}/{assetId}/v{version}/{contentHash}.{ext}`
   - Ingest/quarantine keys: `ingest/{shard}/{tenantId}/{sessionId}/{uploadId}`
   - Export keys: `exports/{shard}/{tenantId}/{exportId}/{filename}`

3. **Data Classification & Delivery (`apps/web/src/lib/storage/classification.ts`, `delivery.ts`)**
   - Every `DataClass` maps to a bucket tier (`public`, `private`, `quarantine`, `exports`), visibility, max size, allowed MIME types, default/max TTL (`HARD_MAX_PRESIGN_GET_TTL_SECONDS = 900`), and retention policy.
   - Public assets deliver via `https://cdn.adzunova.tech` (`buildPublicCdnUrl`) with `Cache-Control: public, max-age=31536000, immutable`.
   - Private/export assets deliver via short-lived presigned GET URLs (`issueBoundedPresignedGet`, max 900s) after server-side tenant/owner authorization.

4. **Metadata Store (`packages/storage-db`)**
   - Isolated Prisma schema (`packages/storage-db/prisma/schema.prisma`) targeting MongoDB (`storage_` collection prefix, optional `STORAGE_MONGODB_DB_NAME`), without modifying `services/identity-service/prisma/schema.prisma`.
   - Collections: `storage_media_assets`, `storage_asset_versions` (immutable), `storage_asset_blobs` (content-addressed dedup + atomic `refCount`), `storage_asset_links`, `storage_asset_events` (append-only SHA-256 hash chain), `storage_upload_sessions` (schema only; S2), `storage_migrations`.
   - Raw index bootstrap (`src/index-bootstrap.mjs`) manages TTL indexes (`expiresAt` on `storage_upload_sessions` and `storage_media_assets`) and partial unique indexes that Prisma's MongoDB schema syntax cannot express.

5. **Compatibility Shim (`apps/web/src/lib/storage/legacy-shim.ts`)**
   - `resolveDisplayAssetUrl` preserves all existing `avatarUrl`, `coverUrl`, `logoUrl`, and external URLs seamlessly while allowing gradual migration to `assetId`-backed URLs.

## Atlas Custom Append-Only Role & Release-Step Procedure
To enforce immutability of `storage_asset_events` at the database layer in production (Atlas M10+):
1. Create a custom Atlas database role `adzunova_storage_app` with `find`, `insert`, `update`, `remove` on `storage_*` collections **except** `storage_asset_events`, which is granted **`find` and `insert` only** (no `update`, no `remove`).
2. Grant a separate `adzunova_storage_migrator` role (used only in CI/CD release steps, never by the runtime web/API servers) `dbAdmin` + `readWrite` to run `prisma db push`, `index-bootstrap.mjs up`, and `migration-runner.mjs up` prior to application rollout.

---

## Phase S2: Direct-to-R2 Upload Architecture & Scale Notes

### Direct-to-R2 Data Path
- Object bytes **never pass through Next.js / Render servers**. The browser computes a streaming SHA-256 in `/workers/sha256-worker.js`, requests a short-lived presigned `PUT` or `UploadPart` URL from stateless Next.js route handlers, and uploads directly to `adzunova-dev-quarantine` (dev) / `ingest-quarantine` (prod).
- Part-size rule (ADR 0001 verified): minimum `5 MiB` (`R2_MIN_PART_SIZE_BYTES`), maximum `5 GiB`, part count capped at `<= 9,000` (with margin below R2's `10,000` limit).

### Write Budget & Cleanup
- **MongoDB Write Budget per Upload:** `1` write at `POST /api/storage/uploads` (`storage_upload_sessions`) + `1` update at `POST /api/storage/uploads/:id/complete` (+ asset/version/blob/event creation). `POST .../parts` performs **0 MongoDB writes**; part ETags stay in browser `sessionStorage` and are verified via `listParts` + `CompleteMultipartUpload`.
- **TTL & Orphan Cleanup:** `storage_upload_sessions.expiresAt` has a MongoDB TTL index (`expireAfterSeconds: 0`). Incomplete R2 multipart uploads are aborted by `DELETE /api/storage/uploads/:id` and by R2's 7-day incomplete-multipart lifecycle rule.
- **Rate Limits & Quotas:** Per-user (`30–60 req/min`) and per-IP (`60–120 req/min`) sliding-window limits on upload/presign endpoints; per-tenant quota defaults to `STORAGE_USER_QUOTA_BYTES` (`1 GiB` env default, as no plan-level quota table exists yet).

### Capacity Math (1M Concurrent Uploaders)
- Single-PUT upload: `1` Class A (`PutObject`) + `1` Class B (`HeadObject`/`GetObject` validation) + `2` Class A (`PutObject` WebP + thumb) + `1` Class A (`DeleteObject` quarantine) = **4 Class A + 1 Class B** per public image.
- Multipart upload (e.g., 12 parts): `1` `CreateMultipartUpload` + `12` `UploadPart` + `1` `CompleteMultipartUpload` + `1` `CopyObject` + `1` `DeleteObject` = **16 Class A** ops.
- At R2 Standard **$4.50 / 1M Class A ops**, **1,000 single-PUT image uploads** cost ~**$0.018** in Class A ops (`4,000 * $4.50 / 1,000,000`); **1,000 12-part multipart uploads** cost ~**$0.072** in Class A ops.

### Deferred to Later Phases
- **S4:** Asynchronous malware scanning (`ScanPort` / ClamAV worker); private files currently carry `scanStatus: 'NOT_SCANNED'` and display `Not yet scanned`.
- **S5:** Video/document transcoding (`ffprobe`/`ffmpeg` proxy generation).
- **S6:** Rich metadata search & indexing.
- **S7:** Cross-tenant sharing & fine-grained ACLs.
