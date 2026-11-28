# Adzunova Storage Threat Model (STRIDE & Abuse Cases — S0)

## 1. STRIDE Matrix

| Surface | Threat (STRIDE) | Mitigation |
|---|---|---|
| **Upload (`ingest-quarantine`)** | **S**poofing / **T**ampering (forged MIME type, polyglot payload, uploading for another user) | Server-issued presigned PUT bound to authenticated `creatorId`/`workspaceId`, strict `Content-Length` + `Content-Type` signing, magic-byte inspection + re-encoding in `processor` before promotion. |
| **Download (`private-vault`)** | **I**nformation Disclosure (IDOR / unauthorized access to contracts, KYC, invoices) | `private-vault` is never public; every download requires session + DB ownership/workspace RBAC check before issuing a 60–300s presigned GET. |
| **Processing (`processor`)** | **D**oS / **E**levation of Privilege (decompression bombs, parser exploits, SSRF) | Strict byte limits (`MAX_*_SIZE_BYTES`), sandboxed worker timeouts/memory caps, no external URL fetching inside processors. |
| **Admin & Tokens** | **R**epudiation / **I**nformation Disclosure (secret leakage, unlogged deletions) | Separate least-privilege R2 tokens (`upload-signer`, `processor`, `reader`), `admin-lifecycle` never in app runtime, immutable audit log, log scrubber for keys & presigned URLs. |

---

## 2. Specific Abuse Cases & Defenses

1. **Storage Bombs / Oversized Uploads:**
   - *Defense:* Sign `Content-Length` range/exact size in presigned PUT; enforce `MAX_IMAGE_SIZE_BYTES`, `MAX_PDF_SIZE_BYTES`, `MAX_VIDEO_SIZE_BYTES`; abort/expire `ingest-quarantine` objects after 24h.
2. **Hotlinking & Bandwidth Scraping (`public-assets`):**
   - *Defense:* Serve only via `https://cdn.adzunova.tech` (ban `r2.dev`), enable Cloudflare WAF Rate Limiting & Hotlink/Bot rules, set `Cache-Control: public, max-age=31536000, immutable`.
3. **Key Enumeration:**
   - *Defense:* Use 128-bit random UUIDv7/CSPRNG object keys (`v1/<class>/<uuid>.<ext>`); zero sequential IDs; zero PII in keys.
4. **Presigned URL Leakage (Logs / Referrer / Browser History):**
   - *Defense:* Short TTLs (60–300s), `Referrer-Policy: no-referrer` on private download redirects, CI guard + runtime log scrubber forbidding `console.*` of presigned URLs or `X-Amz-Signature`.
5. **Polyglot / Malicious Files (SVG XSS, PDF JS, disguised executables):**
   - *Defense:* Upload goes to `ingest-quarantine` first; verify magic bytes; rasterize/re-encode user images (strip EXIF/scripts); serve downloads with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`.
6. **Cost / Class A Attacks (Multipart Orphan Flooding):**
   - *Defense:* Per-user/workspace upload rate limits, max concurrent open upload sessions, 1-day incomplete multipart abort rule on `ingest-quarantine`.
