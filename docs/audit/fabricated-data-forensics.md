# ADZUNOVA FORENSICS AUDIT: FABRICATED CREATOR DATA IN DISCOVERY & PUBLIC PROFILES
**Generated**: 2026-11-21T16:20:00+05:30  
**Status**: READ-ONLY FORENSICS AUDIT (Phase 1) — ZERO BEHAVIOR/CODE CHANGES MADE  
**Scope**: Whole repository (`apps/web`, `services/identity-service`, `libs/`), Production MongoDB Atlas database (`adzunova`)

---

## 1. CODE AUDIT: LOCATIONS & INVENTED DEFAULTS

### 1.1 Profile Resolvers & Fallbacks by Instagram Username
| File | Lines | Description / Flaw |
|---|---|---|
| `apps/web/src/app/c/[slug]/page.tsx` | 30–32, 102–105 | Intercepts `normSlug === 'a_n_jha1' \|\| normSlug === 'anjha1'`. If not in DB, invokes `seedDemoProfile('creator_anjha1', normSlug)` synthesizing an entire profile with fake bio, fake location, fake tags, and stock avatar instead of returning 404. |
| `apps/web/src/app/api/public/creators/[slug]/route.ts` | 20–23 | Same synthetic interception: calls `seedDemoProfile` on missing profile for `a_n_jha1` / `anjha1`. |
| `apps/web/src/app/api/public/creators/[slug]/og-image/route.tsx` | 15–17 | Same synthetic interception for social card preview images. |
| `apps/web/src/lib/discovery/search-engine.ts` | 169–170 | `const slug = acc.username \|\| 'creator'; const { profile } = await getPublicProfileBySlug(slug)` — Discovery queries public profile by Instagram username (`a_n_jha1`) instead of creator ID (`acc.creator_id`), triggering `seedDemoProfile` and fabricating a duplicate persona. |

---

### 1.2 Synthetic Seed Engines & Stock Images in Non-Test Code
| File | Lines | Fabricated Field / Stock Image | Value Assigned |
|---|---|---|---|
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 544 | `demoTopContent[0].thumbnailUrl` | `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600...` |
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 555 | `demoTopContent[1].thumbnailUrl` | `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600...` |
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 566 | `demoTopContent[2].thumbnailUrl` | `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600...` |
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 582–586 | `seedDemoProfile` fields | `bio: 'Tech creator & AI software architect...'`<br>`tags: ['Tech & Gadgets', 'AI & Software', 'Developer Lifestyle', 'Creator Economy']`<br>`location: 'Bengaluru, India'`<br>`languages: ['English', 'Hindi']` |
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 587 | `seedDemoProfile.avatarUrl` | `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400...` (Stock woman model portrait) |
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 588 | `seedDemoProfile.coverUrl` | `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400...` (Stock gradient banner) |
| `apps/web/src/lib/public-profile/public-profile-repository.ts` | 513–539 | `demoPackages` | Synthetic pricing bundles: ₹65,000 and ₹28,000. |
| `apps/web/src/lib/rate-card/rate-card-repository.ts` | 73–126, 241–257 | `getInitialDefaultSeedItems` | Auto-seeds rate card items into MongoDB if creator items = 0 with default `price: 25000` (₹25,000) and title `'1 Min Dedicated Instagram Reel'`. |

---

### 1.3 Literal Defaults Inside Discovery Card Builder & Render Paths
| File | Line | Field | Assigned Literal Default / Logic Error |
|---|---|---|---|
| `apps/web/src/lib/discovery/search-engine.ts` | 172 | `category` | `profile?.tags?.[0] \|\| 'Lifestyle'` (Fabricated default when no tags exist) |
| `apps/web/src/lib/discovery/search-engine.ts` | 204 | `startingPriceMinor` | `1500000` (₹15,000 fallback when rate card items missing) |
| `apps/web/src/lib/discovery/search-engine.ts` | 205 | `deliverables` | `['REEL', 'STORY']` (Fabricated deliverable list when rate card items missing) |
| `apps/web/src/lib/discovery/search-engine.ts` | 234 | `engagementRate` | `3.8` (Hardcoded decimal presented as authentic aggregate) |
| `apps/web/src/lib/discovery/search-engine.ts` | 243 | `dateStr` | `'Nov 20, 2026'` (Hardcoded date literal fallback) |
| `apps/web/src/lib/discovery/search-engine.ts` | 255 | `locationStr` | `profile?.location \|\| 'Mumbai, India'` (Invented city/country fallback) |
| `apps/web/src/lib/discovery/search-engine.ts` | 261 | `slug` | `profile?.slug \|\| acc.username` (Defaults to IG handle instead of canonical slug) |
| `apps/web/src/lib/discovery/search-engine.ts` | 271 | `views24h` | `18` (Hardcoded 24h view impressions) |
| `apps/web/src/lib/discovery/search-engine.ts` | 272 | `mediaCount` | `Number(acc.media_count \|\| 5)` (Default 5) |
| `apps/web/src/lib/discovery/search-engine.ts` | 275 | `verifiedBadgeText` | `'Meta Verified via OAuth'` (Forbidden unverified marketing claim) |
| `apps/web/src/lib/discovery/search-engine.ts` | 54–88 | `matchScore` | Defaults to 50 base + 25 + 10 = **75% Match** with zero brand brief or query supplied |
| `apps/web/src/app/brand/discover/page.tsx` | 407–412 | `Reach` | Shows `followersCount` labelled as **"Reach"** (`1.58K`), which confuses followers with verified view reach |
| `apps/web/src/app/brand/discover/page.tsx` | 435 | `share18Plus` | `{c.audienceMetrics.share18Plus}% 18+ Audience` prints `0.9942% 18+ Audience` because the ratio (0.9942) is missing `* 100` multiplier |
| `apps/web/src/components/creator/public-profile/public-profile-client.tsx` | 280, 417, 516 | `new Date()` | `new Date().toISOString()` or `new Date(profile.rateCard.updatedAt)` evaluating at render time |
| `apps/web/src/lib/public-profile/serializer.ts` | 104 | `fetchedAt` | `acc.lastSyncedAt \|\| new Date().toISOString()` (Uses render-time date if sync timestamp missing) |

---

## 2. PRODUCTION DATA AUDIT (READ-ONLY QUERY ON ATLAS DB `adzunova`)

### 2.1 Public Profiles (`public_profiles` collection)
| Record | `_id` | `creatorId` | `slug` | `displayName` | `avatarUrl` Source | `tags` | `bio` | `location` | `isPublished` | Created / Updated | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Real** | `6b0095fe...` | `d4dc7a3863c3030b5c840255` | `anjha1` | Achhuta Nand Jha | Google OAuth avatar (`lh3.googleusercontent.com`) | `[]` (empty) | `""` (empty) | `India` | `true` | Nov 20, 2026 / Nov 21, 2026 | Real Google OAuth User |
| **Synthetic Duplicate** | `6b015fe5...` | `creator_anjha1` | `a_n_jha1` | Achhuta Nand Jha | Unsplash stock portrait (`images.unsplash.com/...`) | 4 tags (`Tech & Gadgets`, etc.) | Full fake bio ("Tech creator & AI software architect...") | `Bengaluru, India` | `true` | Nov 21, 2026 09:09:57Z | Injected by `seedDemoProfile` fallback |

### 2.2 Social Accounts (`social_accounts` collection)
| Account ID | `creator_id` | `provider` | `username` | `followers_count` | `media_count` | `views_sample` | `status` | `last_synced_at` | Note |
|---|---|---|---|---|---|---|---|---|---|
| `4c75a9aa...` | `d4dc7a3863c3030b5c840255` | `instagram` | `a_n_jha1` | 1,580 | 5 | 18 | `ACTIVE` | Nov 20, 2026 12:28:11Z | Real OAuth Connected Account |
| `8a7dad84...` | `test_creator_...` | `instagram` | `test_handle_...` | 5,432 | 88 | — | `REVOKED` | Nov 20, 2026 | Old Revoked Probe |
| `744ddadf...` | `test_creator_...` | `instagram` | `test_handle_...` | 5,432 | 88 | — | `REVOKED` | Nov 20, 2026 | Old Revoked Probe |

### 2.3 Rate Card Items (`rate_card_items` collection)
| Count | `creatorId` | Titles | Prices | Status | Source |
|---|---|---|---|---|---|
| 0 | `d4dc7a3863c3030b5c840255` (Real Creator) | None | None | None | Real creator never created any rate card items |
| 4 | `creator_anjha1` (Synthetic Creator) | "1 Min Dedicated Instagram Reel", "YouTube Dedicated Video" | ₹25,000, ₹40,000 | `ACTIVE` | Injected by `getInitialDefaultSeedItems` on synthetic access |

### 2.4 Data Audit Summary Counts
- **Total public profile rows**: 2 (`anjha1` [real], `a_n_jha1` [synthetic]).
- **Creators without a real linked user**: 1 (`creator_anjha1` is a synthetic ID; owner user `d4dc7a3863c3030b5c840255` has no rate card and slug `anjha1`).
- **Users with more than one creator record**: 1 (Achhuta Nand Jha has both `anjha1` and synthetic `a_n_jha1`).
- **Records containing stock-image URLs**: 1 public profile (`a_n_jha1` has Unsplash avatar and cover), plus 3 in-memory top content items.
- **Records containing default-literal rate card values**: 4 rows in `rate_card_items` under `creator_anjha1` with synthetic ₹25,000 / ₹40,000 prices.
- **Search document / Discovery mismatches**: Discovery searched by `acc.username` (`a_n_jha1`), completely bypassing the real profile `anjha1`.

---

## 3. PROVENANCE MAP

### 3.1 Discovery Card (`/brand/discover`)
| Rendered UI Element | Current Rendered Value | True Source | Classification |
|---|---|---|---|
| Display Name | "Achhuta Nand Jha" | `profile.displayName` from synthetic profile `a_n_jha1` | **Synthetic Profile** |
| Handle | "@a_n_jha1" | `acc.username` from Meta Graph API | **Provider API** |
| Avatar | Stock woman model photo | `profile.avatarUrl` (`https://images.unsplash.com/...`) | **LITERAL DEFAULT (Stock Image)** |
| Match Score | "75% Match" | `calculateBestMatchScore` (50 base + 15 engagement + 10 demo) | **LITERAL DEFAULT (Unprompted Score)** |
| Category Badge | "TECH & GADGETS" | `profile.tags[0]` from synthetic profile | **LITERAL DEFAULT (Fake Tag)** |
| Verified Badge | "Meta Verified via OAuth" | Hardcoded string in `search-engine.ts:275` | **LITERAL DEFAULT (Forbidden Claim)** |
| Reach Metric | "1.58K" | `acc.followers_count` (Mislabelled as "Reach") | **MISLABELLED (Followers, not Reach)** |
| Engagement Metric | "3.8%" | Hardcoded float in `search-engine.ts:234` | **LITERAL DEFAULT (Fake Metric)** |
| Starting Price | "₹25,000" | Synthetic `rate_card_items` row created by seed | **LITERAL DEFAULT (Seeded Rate)** |
| Audience Demographics | "0.9942% 18+ Audience" | `snapshot.share_18_plus` (0.9942 rendered without `* 100`) | **FORMATTER BUG** |
| Data As Of | "Data as of Nov 20, 2026 (Meta estimate)" | `acc.last_synced_at` formatted date | **Provider API** |
| "View Profile" Link | `/c/a_n_jha1` | `profile.slug \|\| acc.username` | **WRONG SLUG (IG handle, not canonical slug `anjha1`)** |

---

### 3.2 Public Profile Page (`/c/a_n_jha1` vs `/c/anjha1`)
| Rendered UI Element | `/c/anjha1` (Real Profile) | `/c/a_n_jha1` (Viewed from Discover) | True Source on Real Profile | True Source on Fake Profile |
|---|---|---|---|---|
| Avatar | Achhuta in suit | Stock woman model | Google OAuth profile picture (`lh3.googleusercontent.com`) | Unsplash stock image (`images.unsplash.com/...`) |
| Location | "India" | "Bengaluru, India" | User input in profile editor | Synthetic default literal in `seedDemoProfile` |
| Languages | "English" | "English, Hindi" | User input in profile editor | Synthetic default literal in `seedDemoProfile` |
| Tags / Niche | None (hidden) | 4 tags (`Tech & Gadgets`, etc.) | User input (none provided) | Synthetic default literal array in `seedDemoProfile` |
| Bio | None (hidden) | "Tech creator & AI software architect..." | User input (none provided) | Synthetic default literal string in `seedDemoProfile` |
| Verified Reach | 0 (No reach snapshot) | 0 (Mislabelled as "Total Verified Reach") | Provider API `latestSocial.totalReach` | Provider API `latestSocial.totalReach` |
| Published Content | 0 | 0 | Provider API `acc.mediaCount` sum | Provider API `acc.mediaCount` sum |
| Avg Engagement | 3.8% (Benchmark) | 3.8% (Benchmark) | Hardcoded benchmark in serializer | Hardcoded benchmark in serializer |
| Audience Quality | "Not enough data" | "Not enough data" | Provider API rule (< 3 progression points) | Provider API rule (< 3 progression points) |
| Creative Portfolio | None (hidden) | 3 stock Unsplash cards with fake views (45K, 32K, 28K) | User uploads (none provided) | Synthetic `demoTopContent` in `seedDemoProfile` |
| Verified Via Date | "Nov 20, 2026" | "Nov 21, 2026" | `acc.lastSyncedAt` from DB | Render-time date `new Date().toISOString()` from `profile.updatedAt` |
| Message Button | "Message Creator" | "Message Creator" | Hardcoded button | Hardcoded button (No messaging system exists) |

---

## 4. ANSWERS TO HYPOTHESES H1–H5 (WITH PROVEN EVIDENCE)

### Hypothesis H1: Two creator records exist for one person
- **Verdict: PROVEN TRUE**
- **Evidence**:
  1. MongoDB Atlas `public_profiles` collection holds exactly 2 documents:
     - Record 1 (`_id: 6b0095fe...`): `creatorId: "d4dc7a3863c3030b5c840255"`, `slug: "anjha1"`, `displayName: "Achhuta Nand Jha"`, Google OAuth avatar. This is the authentic record created via the creator profile editor.
     - Record 2 (`_id: 6b015fe5...`): `creatorId: "creator_anjha1"`, `slug: "a_n_jha1"`, `displayName: "Achhuta Nand Jha"`, Unsplash stock avatar. This was created automatically when the discovery engine or browser resolved `/c/a_n_jha1`.
  2. MongoDB Atlas `rate_card_items` collection holds 4 synthetic items under `creator_anjha1` with ₹25,000 / ₹40,000 prices, while `d4dc7a3863c3030b5c840255` has 0 items.

### Hypothesis H2: The `/c/[slug]` resolver falls back to Instagram username and synthesizes a profile with invented defaults instead of returning 404
- **Verdict: PROVEN TRUE**
- **Evidence**:
  1. `apps/web/src/app/c/[slug]/page.tsx:102-105`:
     ```ts
     if (!profile && (normSlug === 'a_n_jha1' || normSlug === 'anjha1')) {
       profile = await seedDemoProfile('creator_anjha1', normSlug);
     }
     ```
  2. `apps/web/src/app/api/public/creators/[slug]/route.ts:20-23`: Same fallback.
  3. `apps/web/src/lib/public-profile/public-profile-repository.ts:509-595`: `seedDemoProfile` synthesizes an entire public profile into MongoDB with Unsplash avatars, fake bio ("Tech creator & AI software architect..."), fake tags, fake location "Bengaluru, India", and fake portfolio items with 45.2K views.

### Hypothesis H3: The discovery adapter/card builder fills missing fields with literal defaults
- **Verdict: PROVEN TRUE**
- **Evidence**:
  1. `apps/web/src/lib/discovery/search-engine.ts:169-170`: Looks up profile by Instagram username `acc.username` (`"a_n_jha1"`), triggering the synthetic profile above.
  2. `apps/web/src/lib/discovery/search-engine.ts:172`: `category = profile?.tags?.[0] || 'Lifestyle'` (Injected fallback category).
  3. `apps/web/src/lib/discovery/search-engine.ts:204`: `startingPriceMinor = 1500000` (Injected ₹15,000 fallback).
  4. `apps/web/src/lib/discovery/search-engine.ts:234`: `const engagementRate = 3.8;` (Injected 3.8% rate).
  5. `apps/web/src/lib/discovery/search-engine.ts:271`: `views24h: 18` (Hardcoded view count).
  6. `apps/web/src/lib/discovery/search-engine.ts:275`: `verifiedBadgeText: 'Meta Verified via OAuth'` (Forbidden marketing claim).
  7. `apps/web/src/lib/discovery/search-engine.ts:54`: Base match score of 50 + 25 + 10 = **75% Match** shown without any search brief.
  8. `apps/web/src/app/brand/discover/page.tsx:435`: `{c.audienceMetrics.share18Plus}%` prints `0.9942%` because the ratio was not converted to percentage.

### Hypothesis H4: Seed/fixture/demo creators exist in the production database or search index
- **Verdict: PROVEN TRUE**
- **Evidence**:
  1. `public_profiles` row `_id: 6b015fe5b2f9fea3c087343f` (`creatorId: "creator_anjha1"`, `slug: "a_n_jha1"`) exists in the production Atlas database `adzunova`.
  2. `rate_card_items` rows `_id: 6b015fea282b8db93dfdc1d4`, `6b015fea282b8db93dfdc1d5`, etc., exist in the production Atlas database `adzunova`.
  3. `social_accounts` collection contains two revoked test accounts from Nov 20: `test_handle_1795166562037` and `test_handle_1795167386745`.

### Hypothesis H5: The CI guards never covered these paths
- **Verdict: PROVEN TRUE**
- **Evidence**:
  1. `scripts/ci-guards.mjs` lines 12–28:
     - Scans `apps/web/src/app/creator/**` and `apps/web/src/app/brand/**`.
     - Did **NOT** scan `apps/web/src/app/c/**` (where `/c/[slug]` lives).
     - Did **NOT** scan `apps/web/src/lib/public-profile/**` (where `seedDemoProfile` and Unsplash stock URLs reside).
     - Did **NOT** scan `apps/web/src/lib/rate-card/**` (where `getInitialDefaultSeedItems` ₹25,000 lives).
     - Did **NOT** scan `apps/web/src/lib/discovery/**` (where `search-engine.ts` literal defaults reside).
  2. The deny-list did not include stock-image domains (`unsplash.com`), `seedDemoProfile`, or `Meta Verified`.

---

## 5. SUMMARY OF ROOT CAUSE & IMMEDIATE REMEDIATION PLAN

### Root Cause Sequence:
1. Achhuta created his authentic public profile with custom slug **`anjha1`** and Google login photo.
2. When he connected Instagram `@a_n_jha1`, the social account record was saved with `creator_id: "d4dc7a3863c3030b5c840255"` and `username: "a_n_jha1"`.
3. When Brand Discovery (`/brand/discover`) searched active accounts, it executed:
   `getPublicProfileBySlug(acc.username)` (`getPublicProfileBySlug("a_n_jha1")`).
4. Because no public profile existed with slug `"a_n_jha1"`, the resolver hit the hardcoded seed fallback:
   `seedDemoProfile('creator_anjha1', 'a_n_jha1')`, which inserted a fake record with stock Unsplash portrait, fake bio, fake Bengaluru location, fake tags, and fake ₹25,000 rate card into MongoDB Atlas.
5. Discovery then rendered this fake record, mislabelled followers as "Reach", printed `0.9942% 18+ Audience`, and linked "View Profile" to `/c/a_n_jha1` instead of the canonical `/c/anjha1`.

### Awaiting Approval Before Phase 2:
Per standing instructions:
- **Zero code or database changes have been made in Phase 1.**
- This forensics audit documents all file/line references, real database rows, and proven root causes.
- We stop here and await your explicit confirmation to proceed with **Phase 2 (One Public Read Model, No Defaults)**.
