# ADR 0002 — Bucket Topology, Least-Privilege Tokens & Cloudflare Runbook

> **Date:** 2026-11-28  
> **Decision:** Partition R2 buckets by **data class, access boundary, and lifecycle**, never by tenant (even though R2 supports up to 1,000,000 buckets/account).

---

## 1. Bucket Topology (4 Production Buckets + Dev Mirrors)

| Bucket | Public Access | Custom Domain | Lifecycle / Retention | Data Classes Allowed |
|---|---|---|---|---|
| `public-assets` | Yes (Read-Only via CDN) | `https://cdn.adzunova.tech` (WAF + Smart Tiered Cache) | Permanent while referenced; immutable keys (`v1/<class>/<uuid>`) | Processed & scanned public avatars, cover banners, brand logos, public media-kit thumbnails |
| `private-vault` | **Never Public** | None (private presigned GET or Worker auth) | Standard -> IA after 90d for cold contracts/invoices; Bucket Lock on finalized legal/tax docs | Contracts, KYC/PAN/GST docs, invoices, raw campaign deliverables before public release |
| `ingest-quarantine` | **Never Public** | None | **Hard delete after 24 hours**; abort incomplete multipart after 1 day | Untrusted direct client uploads awaiting magic-byte inspection, transcoding, and virus scan |
| `exports-temp` | **Never Public** | None | **Hard delete after 7 days** | Async GDPR/DPDP data exports, generated PDF media kits, CSV audit reports |

*(Dev environment mirrors: `adzunova-dev-public`, `adzunova-dev-private`, `adzunova-dev-quarantine`, `adzunova-dev-exports`.)*

---

## 2. Least-Privilege API Tokens per Role

| Role | Allowed Buckets | R2 Permissions | Used By |
|---|---|---|---|
| `upload-signer` | `ingest-quarantine` | Object Write only (or S3 presign-only scoped key) | Web/API presign endpoint (`S1`/`S2`) |
| `processor` | `ingest-quarantine` (R/W/Delete), `public-assets` (Write), `private-vault` (Write) | Object Read & Write (no bucket delete, no lifecycle admin) | Async media worker / scanner (`S3`/`S4`) |
| `reader` | `private-vault` (Read), `exports-temp` (Read/Write) | Object Read (and Write on `exports-temp` only) | Authenticated download signer & export generator |
| `admin-lifecycle` | All 4 buckets | Admin Read & Write (lifecycle, CORS, event rules) | Ops / Terraform / CI setup only — **never deployed to app runtime** |

---

## 3. Owner Cloudflare Dashboard Runbook

1. **Create 2 Missing Production Buckets** (in Cloudflare Dashboard → **R2 Object Storage**):
   - Create `ingest-quarantine` (no public access, no `r2.dev`, no custom domain).
   - Create `exports-temp` (no public access, no `r2.dev`, no custom domain).
   - *(Optional for safe testing)* Create dev bucket `adzunova-dev-quarantine` for S1/S2 probes.
2. **Disable `r2.dev` Public Subdomain** on `public-assets` and `private-vault` (ensure `private-vault` has **zero** public access).
3. **Configure Custom Domain on `public-assets`:**
   - Attach `cdn.adzunova.tech` under **Settings → Public Access → Custom Domains**.
   - Enable **Smart Tiered Cache** and configure **WAF Rate Limiting** on `cdn.adzunova.tech`.
4. **Configure Lifecycle Rules:**
   - `ingest-quarantine`: Delete objects older than **1 day**; abort incomplete multipart uploads after **1 day**.
   - `exports-temp`: Delete objects older than **7 days**.
   - `private-vault`: Abort incomplete multipart uploads after **7 days** (optional IA transition after 90 days).
5. **Configure CORS on `ingest-quarantine` (and dev bucket):**
   - `AllowedOrigins`: `["https://adzunova.tech"]` (and `http://localhost:3000` on dev bucket only).
   - `AllowedMethods`: `["PUT", "GET", "HEAD"]`.
   - `AllowedHeaders`: `["Content-Type", "Content-Length", "Content-MD5"]`.
   - `ExposeHeaders`: `["ETag"]`.
6. **Create Least-Privilege API Tokens** (R2 → **Manage R2 API Tokens**) for `upload-signer`, `processor`, and `reader`, and store them in Render / `.env.local` (never commit to Git).
