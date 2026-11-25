# YouTube Quota Budget, Scheduler & Compliance Runbook

> **Official References:**
> - YouTube Data API v3 Quota Cost Calculator: https://developers.google.com/youtube/v3/determine_quota_cost
> - YouTube Analytics API v2 Reports: https://developers.google.com/youtube/analytics/reference/reports/query
> - YouTube API Services Terms of Service & Developer Policies: https://developers.google.com/youtube/terms

---

## 1. Data API v3 Unit Cost Table

| Endpoint | Cost (units) | Usage in Adzunova |
|---|---|---|
| `channels.list` (`mine=true`) | **1** | Channel stats (`subscriberCount`, `hiddenSubscriberCount`, `viewCount`, `videoCount`, `uploads` playlist) |
| `playlistItems.list` | **1** | Fetch up to 50 recent video IDs from `relatedPlaylists.uploads` |
| `videos.list` (batched `id=...`) | **1** | Batch video stats (`viewCount`, `likeCount`, `commentCount`, `duration`) |
| `search.list` | **100** | **Prohibited** in automated sync (`YouTubeQuotaBudgeter.canSpend('search.list')` always returns `false`) |

**Total per full sync:** **3 Data API units** (plus Analytics API v2 calls for daily series, `ageGroup,gender`, and `country`).  
**Default Daily Project Quota:** `10,000` units/day, resetting at **midnight Pacific Time (`America/Los_Angeles`)**.

---

## 2. Graceful Degradation & Alerts (`youtube-quota.ts`)

| Quota Burn % | Alert Level | Degradation Mode | Behavior |
|---|---|---|---|
| `< 80%` | `NORMAL` | `FULL` | Core stats + Analytics series & demographics + Top videos |
| `80% – 89%` | `WARN_80` | `SKIP_TOP_VIDEOS` | Skip `playlistItems.list` + `videos.list`; keep core stats & Analytics |
| `90% – 99%` | `WARN_80` | `CORE_STATS_ONLY` | Only `channels.list` for `HOT` tier accounts |
| `100%` / `quotaExceeded` | `EXHAUSTED_100` | `HALTED` | Stop all Data API calls; set `next_sync_at` to `getNextQuotaResetPT()` |

---

## 3. Render Scheduler & Multi-Instance Safety

- **Trigger:** Render Cron Job sends `POST /api/internal/social-sync` with `Authorization: Bearer $INTERNAL_CRON_SECRET` (validated via `crypto.timingSafeEqual`; fails closed with 503 if `INTERNAL_CRON_SECRET` is unset).
- **Sharding:** Accounts are deterministically partitioned by `hash(account_id) % totalShards` (`getAccountShard`).
- **Concurrency & Restarts:** Per-account lease lock (`acquireAccountLease` / `releaseAccountLease`) prevents concurrent duplicate syncs; `social_outbox_events` and `social_metrics_snapshots` use idempotent upserts keyed by `(account_id, metric_name, period, metric_date)` so instance restarts are safe.

---

## 4. Quota Extension & Compliance Audit Path

When active creators approach ~2,500+ syncs/day on a 10,000-unit default quota:
1. Ensure Google OAuth consent screen verification (sensitive scope `youtube.readonly`) is complete and **In Production**.
2. Submit the **YouTube API Services Quota Extension Form** in Google Cloud Console with:
   - Production privacy policy & terms URLs
   - Verified `youtube-quota.ts` cost breakdown showing 3 units/sync and `search.list` avoidance
   - Compliance audit attestation (`docs/compliance/youtube-api.md`).
