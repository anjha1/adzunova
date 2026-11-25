# Google OAuth Scope Justifications (Sensitive Scope Verification)

## Application
- **Product:** Adzunova (Creator–Brand Advertising Marketplace)
- **OAuth Client:** Adzunova YouTube Connect (Web)
- **Google Cloud Project:** `adzunova`
- **Access Type:** Strictly read-only (no write scopes, no monetary scope)

---

## Requested Scopes & Exact Code Mapping

### 1. `https://www.googleapis.com/auth/youtube.readonly` (Sensitive)
- **Why needed:** To verify channel ownership (`mine=true`), channel identity (ID, title, `customUrl`, avatar), official subscriber count (respecting `hiddenSubscriberCount`), total channel views, video count, and recent uploads via the uploads playlist without using high-cost `search.list`.
- **Exact API calls in codebase:**
  - `GET https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics,contentDetails&mine=true`
    - [youtube-client.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-client.ts) (`fetchYouTubeChannelMine`, `runYouTubeProbeMatrix`)
    - [youtube-sync.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-sync.ts) (`syncYouTubeAccount`)
  - `GET https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId={uploads}&maxResults=10`
    - [youtube-sync.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-sync.ts)
  - `GET https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics,contentDetails&id={ids}`
    - [youtube-sync.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-sync.ts)
- **Screens using this data:**
  - `/creator/accounts` (channel identity, subscriber count or "Hidden by creator", video count, channel views)
  - `/c/[slug]` & `/creator/media-kit` (verified connected YouTube channel summary)
  - `/brand/discover` (verified creator discovery card)
- **Why a narrower scope is insufficient:** Google Sign-In (`openid email profile`) does not grant YouTube channel ownership or statistics access. There is no narrower scope that reads `channels.list?mine=true` statistics and uploads playlist video stats. Write scopes (`youtube`, `youtube.force-ssl`, `youtube.upload`) are intentionally **not** requested.

### 2. `https://www.googleapis.com/auth/yt-analytics.readonly`
- **Why needed:** To fetch verified daily views, watch time, subscriber gains/losses, and aggregated viewer demographics (`ageGroup × gender`, `country`) so brands can verify audience quality and regional fit without self-reported screenshots.
- **Exact API calls in codebase:**
  - `GET https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&metrics=views,estimatedMinutesWatched,subscribersGained,subscribersLost&dimensions=day`
  - `GET https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&metrics=viewerPercentage&dimensions=ageGroup,gender`
  - `GET https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&metrics=views&dimensions=country`
    - [youtube-client.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-client.ts) & [youtube-sync.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-sync.ts)
- **Screens using this data:**
  - `/creator/analytics` (YouTube tab: daily series, viewer age/gender labeled `"Google estimate"`, country views, `"Data through <date>"`)
  - `/brand/discover` (18+ viewer filter and top country filter)
- **Why a narrower scope is insufficient:** `youtube.readonly` only returns public channel totals, not daily watch-time series or viewer age/gender/country breakdowns. Monetary scope (`yt-analytics-monetary.readonly`) is intentionally **not** requested.
