# YouTube Connect — Phase 1 Probe Matrix & Official API Reference

> **Status:** Minimal connect & scrubbed probe routes deployed (`DEBUG_OAUTH=true` gated).  
> **Standing Rule:** Live-traffic response payloads and `tests/fixtures/google/youtube/*.json` will be frozen from real Google responses once the owner connects a test-user Google account with a YouTube channel. No synthetic or guessed fixtures are committed.

---

## 1. Official Documentation Grounding

- **Google OAuth 2.0 for Web Server Applications:** https://developers.google.com/identity/protocols/oauth2/web-server
  - Authorization endpoint: `https://accounts.google.com/o/oauth2/v2/auth`
  - Token & refresh endpoint: `https://oauth2.googleapis.com/token`
  - Revocation endpoint: `https://oauth2.googleapis.com/revoke`
  - PKCE (`code_challenge` + `code_challenge_method=S256`), `access_type=offline`, `prompt=consent`
  - **Testing status policy:** While the OAuth consent screen publishing status is **Testing**, issued refresh tokens expire after **7 days** (https://developers.google.com/identity/protocols/oauth2/policies).
- **YouTube Data API v3 Quota & Endpoints:** https://developers.google.com/youtube/v3/determine_quota_cost
  - `channels.list`: **1 unit** per call
  - `playlistItems.list`: **1 unit** per call (up to 50 items)
  - `videos.list`: **1 unit** per call (batched up to 50 video IDs)
  - `search.list`: **100 units** per call — **avoided** in favor of `channels.list` -> `contentDetails.relatedPlaylists.uploads` -> `playlistItems.list` -> `videos.list` (total 3 units instead of 101+ units).
  - Default daily project quota: **10,000 units/day** (resets at midnight Pacific Time).
- **YouTube Analytics API v2:** https://developers.google.com/youtube/analytics/reference/reports/query
  - Endpoint: `GET https://youtubeanalytics.googleapis.com/v2/reports`
  - Required params: `ids=channel==MINE`, `startDate=YYYY-MM-DD`, `endDate=YYYY-MM-DD`, `metrics=...`
  - Demographics basis: **viewers** (`viewerPercentage` across `ageGroup,gender`), NOT subscribers/followers.

---

## 2. Probe Matrix

| Probe Key | Endpoint Template | Params | Quota Cost | Live HTTP Status | Shape Summary & Notes |
|---|---|---|---|---|---|
| `oauth_token_exchange` | `POST https://oauth2.googleapis.com/token` | `code`, `client_id`, `client_secret`, `redirect_uri`, `grant_type=authorization_code`, `code_verifier` | 0 | *Pending live connect* | Verify keys (`access_token`, `refresh_token`, `expires_in`, `scope`, `token_type`) and confirm both scopes granted. |
| `channels_list_mine` | `GET /youtube/v3/channels` | `part=id,snippet,statistics,contentDetails&mine=true` | 1 unit | *Pending live connect* | Record `items[]` count (0 = `no_channel`), `hiddenSubscriberCount`, `subscriberCount` format, `customUrl`, `thumbnails`, `relatedPlaylists.uploads`. Also test brand-account channel selection. |
| `playlist_items_uploads` | `GET /youtube/v3/playlistItems` | `part=snippet,contentDetails&playlistId={uploads}&maxResults=10` | 1 unit | *Pending live connect* | Extract `contentDetails.videoId` and `videoPublishedAt` without calling `search.list`. |
| `videos_list_batched` | `GET /youtube/v3/videos` | `part=id,snippet,statistics,contentDetails&id={ids}` | 1 unit | *Pending live connect* | Batched real stats (`viewCount`, `likeCount`, `commentCount`, `duration`) for top videos. |
| `analytics_daily_series` | `GET /v2/reports` | `ids=channel==MINE&metrics=views,estimatedMinutesWatched,subscribersGained,subscribersLost&dimensions=day` | Analytics API | *Pending live connect* | Record data lag (`data_through_date`), row ordering, and empty-result shape for low-traffic channels. |
| `analytics_demographics_age_gender` | `GET /v2/reports` | `ids=channel==MINE&metrics=viewerPercentage&dimensions=ageGroup,gender` | Analytics API | *Pending live connect* | Record `viewerPercentage` buckets and empty/insufficient-data behavior for low-traffic channels. |
| `analytics_country_views` | `GET /v2/reports` | `ids=channel==MINE&metrics=views&dimensions=country&sort=-views&maxResults=25` | Analytics API | *Pending live connect* | Record country ISO codes, view counts, and empty-result behavior. |

---

## 3. Error Taxonomy Targets

| Error / Reason Code | Expected Source | Handling |
|---|---|---|
| `access_denied` | Google OAuth redirect `?error=access_denied` | Map to `consent_denied` |
| `missing_scope` | Token `scope` missing either readonly scope | Map to `missing_scope` with actionable prompt |
| `no_refresh_token` | Token response lacks `refresh_token` | Map to `no_refresh_token` |
| `invalid_grant` | `oauth2.googleapis.com/token` (expired/revoked/Testing 7d) | Mark `RECONNECT_REQUIRED`, notify creator |
| `redirect_uri_mismatch` | Google OAuth error screen | Verified via `youtube-preflight` |
| `accessNotConfigured` | Data/Analytics API disabled in GCP | Surface `google_api_error` reason code |
| `insufficientPermissions` / `forbidden` | 403 missing scope or channel permissions | Surface `google_api_error` reason code |
| `quotaExceeded` / `rateLimitExceeded` | 403 quota / rate limit | Stop sync until PT midnight reset / backoff |
| `channelNotFound` / `items=[]` | Google account with no YouTube channel | Map to `no_channel` |
| `5xx` | Upstream Google transient error | Bounded retry with backoff |

---

## 4. Scrubbed Log Lines to Capture During Live Probe

When `DEBUG_OAUTH=true` is enabled and the owner connects a test-user Google account that owns a YouTube channel via `/creator/me/social-accounts/youtube/connect`, the server emits these **scrubbed** log prefixes (tokens, codes, secrets, and full IDs are automatically redacted):

1. `[YouTubeOAuthDebug] step2_state_validation ...`
2. `[YouTubeOAuthDebug] step3_token_exchange ...`
3. `[YouTubeOAuthDebug] step4_scope_verification ...`
4. `[YouTubeOAuthDebug] step5_channel_discovery ...`
5. `[YouTubeOAuthDebug] step6_probe_matrix ...`
