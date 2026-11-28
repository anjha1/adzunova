# Storage Current-State Audit (S0 Read-Only)

> **Audit Date:** 2026-11-28  
> **Scope:** Read-only inspection of all file, media, avatar, logo, document, and R2/storage references across `apps/web/src`, `services/`, `packages/`, and env files. Zero runtime behavior modified.

---

## 1. Environment Variables Inventory (Names Only — Never Values)

- **Root `.env`** contains storage/media variable names:
  `R2_ACCOUNT_ID`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BUCKET_NAME`, `R2_PRIVATE_BUCKET_NAME`, `NEXT_PUBLIC_CDN_BASE`, `R2_UPLOAD_URL_EXPIRY`, `R2_DOWNLOAD_URL_EXPIRY`, `UPLOAD_SESSION_TTL_SECONDS`, `R2_MULTIPART_PART_SIZE_BYTES`, `R2_MULTIPART_THRESHOLD_BYTES`, `MAX_VIDEO_SIZE_BYTES`, `MAX_PDF_SIZE_BYTES`, `MAX_IMAGE_SIZE_BYTES`, `ALLOWED_VIDEO_MIME_TYPES`, `ALLOWED_PDF_MIME_TYPES`, `ALLOWED_IMAGE_MIME_TYPES`, `CLOUDFLARE_STREAM_ACCOUNT_ID`, `CLOUDFLARE_STREAM_API_TOKEN`, `CLOUDFLARE_STREAM_WEBHOOK_SECRET`, `CLOUDFLARE_STREAM_SIGNING_KEY_ID`, `CLOUDFLARE_STREAM_SIGNING_KEY_PEM`, `CLOUDFLARE_STREAM_CUSTOMER_CODE`, `FEATURE_STREAM_REVIEW`, `VIRUS_SCAN_ENABLED`, `CLAMAV_HOST`, `CLAMAV_PORT`, `FEATURE_STORAGE_UPLOADS`.
  - Observation: `R2_PUBLIC_BUCKET_NAME` is **not** a dev bucket (`isDev = false`), so no write probes were executed against it.
- **`apps/web/.env.local`**: Contains **zero** `R2_*`, `CLOUDFLARE_*`, or `FEATURE_STORAGE_*` keys.
- **`services/identity-service/.env`**: Contains **zero** `R2_*` or storage keys.
- **AWS SDK (`@aws-sdk/client-s3`):** Not installed in `node_modules`.

---

## 2. Codebase Touchpoints & How Files Flow Today

| Area | File Paths | Current Flow |
|---|---|---|
| **Creator Avatars & Covers** | [public-profile/route.ts](file:///D:/Adzunova/apps/web/src/app/api/creator/public-profile/route.ts), [creator/profile/page.tsx](file:///D:/Adzunova/apps/web/src/app/creator/profile/page.tsx), [serializer.ts](file:///D:/Adzunova/apps/web/src/lib/public-profile/serializer.ts), [public-profile-client.tsx](file:///D:/Adzunova/apps/web/src/components/creator/public-profile/public-profile-client.tsx) | External URL strings (`avatarUrl`, `coverUrl`) saved in MongoDB `public_profiles` / `users` (Google OAuth `lh3.googleusercontent.com` or pasted URL). Stock photo domains (`unsplash`, `pexels`, etc.) are rejected at serialization. **No binary upload to R2.** |
| **Brand Logos** | [brand/onboarding/page.tsx](file:///D:/Adzunova/apps/web/src/app/brand/onboarding/page.tsx), [schema.prisma](file:///D:/Adzunova/services/identity-service/prisma/schema.prisma) | String `logoUrl` stored in PostgreSQL/Prisma `BrandProfile` & `Workspace`. **No binary upload to R2.** |
| **Social Avatars (IG / YT)** | [youtube/callback/route.ts](file:///D:/Adzunova/apps/web/src/app/api/auth/youtube/callback/route.ts), [search-engine.ts](file:///D:/Adzunova/apps/web/src/lib/discovery/search-engine.ts) | External provider URLs (`profile_picture_url`) stored directly; **not mirrored** to R2 CDN yet (prone to expiring CDN URLs). |
| **Capabilities Endpoint** | [api/capabilities/route.ts](file:///D:/Adzunova/apps/web/src/app/api/capabilities/route.ts) | Previously hardcoded `storage: { configured: true, status: 'ACTIVE' }` without checking any `R2_*` env vars! |
| **FormData (Webhooks only)** | [data-deletion/route.ts](file:///D:/Adzunova/apps/web/src/app/api/auth/instagram/data-deletion/route.ts), [deauthorize/route.ts](file:///D:/Adzunova/apps/web/src/app/api/auth/instagram/deauthorize/route.ts) | Parses Meta `signed_request` form fields only; zero file uploads. |

---

## 3. Existing Tables / Collections
- **Prisma (`services/identity-service/prisma/schema.prisma`):** Stores `avatarUrl`, `coverUrl`, `logoUrl` as nullable strings. **No `storage_objects`, `upload_sessions`, or `media_variants` tables exist.**
- **MongoDB (`adzunova`):** `public_profiles`, `users`, `social_accounts` store URL strings only.

---

## 4. What Is Broken, Missing, and Risks
1. **False Capability Reporting:** `/api/capabilities` reported `storage: ACTIVE` even when `apps/web` had zero R2 credentials or SDK installed.
2. **External URL Fragility:** Social avatars (Instagram/YouTube) rely on third-party URLs that can expire or break hotlinking.
3. **No Upload / Quarantine / Verification Pipeline:** Creators and brands must paste external URLs; no presigned upload, magic-byte/MIME validation, virus scan, or private vault access control exists yet.
4. **No Dev Bucket Separation in `.env`:** Root `.env` points `R2_PUBLIC_BUCKET_NAME` to a non-dev bucket, risking accidental writes during local tests.
5. **No Dedicated Quarantine or Short-Lived Exports Buckets:** Only `public-assets` and `private-vault` exist today.
