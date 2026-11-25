# YouTube Integration — Capacity, Quota & Scale Architecture

## 1. Why Quota (Not CPU) Is the Bottleneck
Each full YouTube sync consumes **3 YouTube Data API v3 units**:
- `channels.list?mine=true` = **1 unit**
- `playlistItems.list` (uploads playlist) = **1 unit**
- `videos.list` (batched up to 50 IDs) = **1 unit**
- (`search.list` = 100 units — **prohibited** in automated sync)

YouTube Analytics API v2 (`reports.query`) has separate per-project QPD/QPM limits and consumes 0 Data API v3 units.

### Capacity Math on Default 10,000 Units/Day Quota
- **Full sync (3 units):** `10,000 / 3 ≈ 3,333` full syncs/day across all creators.
- **Core-stats-only sync (1 unit):** up to `10,000` syncs/day.
- **Tiered Sync Allocation (with 3 units/full sync):**
  - `HOT` tier (active campaigns / logged in ≤48h, 4h interval = 6 syncs/day = 18 units/creator/day): 100 HOT creators = **1,800 units/day**.
  - `WARM` tier (standard active creator, 24h interval = 1 sync/day = 3 units/creator/day): 2,000 WARM creators = **6,000 units/day**.
  - `COLD` tier (inactive >30d or ≥5 failures, 7d interval ≈ 0.14 syncs/day = 0.43 units/creator/day): 5,000 COLD creators = **~2,150 units/day**.
  - **Total:** ~7,100 creators supported within the default 10,000-unit daily budget before requiring quota extension!

---

## 2. Bandwidth, Latency & Cost Controls
1. **Partial Responses (`fields=`):** Every Data API call specifies exact `fields=` projections (`items(id,snippet(...),statistics(...))`) to cut JSON payload size by >70%.
2. **Batched Video Lookups:** Up to 50 video IDs are fetched in a single 1-unit `videos.list` request.
3. **Negative-Result Caching:** Per-account `capabilities` stores unavailable Analytics metrics (e.g., `insufficientData`) so UI renders honest `"Not available for this channel: <reason>"` without repeating failing queries.
4. **Graceful Degradation Order (`YouTubeQuotaBudgeter`):**
   - `80%–89%` daily burn (`WARN_80`): `SKIP_TOP_VIDEOS` (skip `playlistItems.list` + `videos.list`; keep core stats + Analytics).
   - `90%–99%` daily burn: `CORE_STATS_ONLY` (`HOT` tier `channels.list` only).
   - `100%` / `quotaExceeded`: `HALTED` until midnight Pacific Time (`getNextQuotaResetPT()`).

---

## 3. Staleness SLOs & Degraded Modes
| Tier | Target Sync Cadence | Staleness SLO | Degraded Mode (Google API Outage / Quota Exhausted) |
|---|---|---|---|
| `HOT` | Every 4 hours (±15% jitter) | ≤ 6 hours | Serve last stored snapshot with `lastSyncedAt` & `Data as of` badge |
| `WARM` | Every 24 hours (±15% jitter) | ≤ 36 hours | Serve last stored snapshot with `lastSyncedAt` & `Data as of` badge |
| `COLD` | Every 7 days (±15% jitter) | ≤ 10 days | Serve last stored snapshot |

---

## 4. Multi-Region Token Vault & Quota Extension Plan
- **Token Vault Isolation:** `social_credentials` stores AES-256-GCM encrypted refresh tokens keyed by `key_id`, separated from public profile read collections. For multi-region compliance (e.g., India DPDP / EU GDPR), `social_credentials` can be partitioned by `home_region` while keeping public read models replicated for low-latency discovery.
- **Quota Extension Trigger:** Request a quota increase in Google Cloud Console once sustained daily burn exceeds **70%** (`7,000 units/day`) after Google OAuth verification is approved.
