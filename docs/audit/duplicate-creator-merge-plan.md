# ADZUNOVA — DUPLICATE CREATOR RESOLUTION & MERGE PLAN (PHASE 3)
**Generated**: 2026-11-21T17:10:00+05:30  
**Status**: APPROVED MERGE STRATEGY (Phase 3 Specification; Executed in Phase 4)  
**Database**: MongoDB Atlas (`adzunova`)

---

## 1. INVENTORY OF DUPLICATES

| Field | Real Authentic Record (TO KEEP) | Synthetic Seed Record (TO PURGE) |
|---|---|---|
| **Collection** | `public_profiles` | `public_profiles` |
| **`_id`** | `6b0095fe20a23e59ba334eb0` | `6b015fe5b2f9fea3c087343f` |
| **`creatorId`** | `d4dc7a3863c3030b5c840255` (Authentic User ID) | `creator_anjha1` (Synthetic demo ID) |
| **`slug`** | `anjha1` (Creator-chosen custom URL) | `a_n_jha1` (Instagram handle fallback) |
| **`displayName`** | Achhuta Nand Jha | Achhuta Nand Jha |
| **`avatarUrl`** | Google OAuth Photo (`lh3.googleusercontent.com`) | Stock Unsplash Photo (`images.unsplash.com`) |
| **`bio`** | `""` (Authentic empty user input) | `"Tech creator & AI software architect..."` (Fabricated) |
| **`location`** | `"India"` (Authentic user input) | `"Bengaluru, India"` (Fabricated) |
| **`tags`** | `[]` (Authentic empty user input) | `["Tech & Gadgets", "AI & Software", ...]` (Fabricated) |
| **`rate_card_items`** | 0 items (Creator has not published rates) | 4 items (`1 Min Dedicated Reel`, ₹25K, ₹40K - Seeded) |
| **`social_accounts`** | Active `@a_n_jha1` linked to `d4dc7a3863c3030b5c840255` | None (all social accounts link to real user ID) |

---

## 2. MERGE & PURGE STRATEGY

### Principle: 1 Person = 1 Creator Identity
1. **Preserve Authentic Record**:
   - `creatorId`: `d4dc7a3863c3030b5c840255`
   - Canonical URL: `/c/anjha1`
   - Real connected channel: Instagram `@a_n_jha1` (Followers: 1,580, 24h Views: 18, Posts: 5).
2. **Carry Over Verification**:
   - Social accounts are already linked to `creator_id: "d4dc7a3863c3030b5c840255"`. No relinking necessary.
   - Any future social accounts connected by Achhuta Nand Jha will strictly attach to `d4dc7a3863c3030b5c840255`.
3. **Purge Synthetic Artifacts**:
   - Delete `public_profiles` where `creatorId === 'creator_anjha1'` (or `slug === 'a_n_jha1'`).
   - Delete `rate_card_items` where `creatorId === 'creator_anjha1'`.
   - Delete `profile_view_events` or `profile_reports` referencing `creator_anjha1`.
4. **Reversibility Guarantee**:
   - Before executing Phase 4 purge, export the target records to `docs/audit/backups/pre-purge-backup-creator_anjha1.json`.
   - If restoration is ever required, an idempotent rollback script (`restore-synthetic-backup.js`) can re-insert them.

---

## 3. SLUG CONFLICT RESOLUTION
- If a brand or external link navigates to the old URL `/c/a_n_jha1`:
  - With the synthetic profile purged, `a_n_jha1` will return **404 Not Found**.
  - If the creator Achhuta Nand Jha ever wishes to adopt `a_n_jha1` as his custom slug, he can do so via his Creator Profile Editor at `/creator/profile`, which updates `slug: 'a_n_jha1'` on his authentic record `d4dc7a3863c3030b5c840255` and adds `anjha1` to `previousSlugs` (301 redirect).
  - The system will **never** automatically map Instagram handles to URLs without explicit user choice.

---

## 4. UNIQUE CONSTRAINTS ENFORCEMENT
MongoDB Atlas index specification:
```javascript
db.collection('public_profiles').createIndex({ creatorId: 1 }, { unique: true });
db.collection('public_profiles').createIndex({ slug: 1 }, { unique: true });
db.collection('creator_profiles').createIndex({ userId: 1 }, { unique: true });
```
This guarantees that no user can ever have more than one public creator profile record.
