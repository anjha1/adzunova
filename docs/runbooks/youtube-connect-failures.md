# Runbook: YouTube Connect & Sync Failures

## 1. Error Code Triage

| Code / Reason | Root Cause | Immediate Action |
|---|---|---|
| `redirect_uri_mismatch` | Google OAuth client redirect URI does not match `YOUTUBE_REDIRECT_URI` | Run `node scripts/dev/youtube-preflight.mjs`. Verify Google Cloud Console has exact `https://adzunova.tech/api/auth/youtube/callback` and zero trailing slashes. |
| `access_denied` (`consent_denied`) | Creator clicked Cancel on Google consent screen | Expected user behavior. Creator can retry via `/creator/accounts`. |
| `missing_scope` | Creator unchecked `youtube.readonly` or `yt-analytics.readonly` | Expected user choice. UI displays `missing_scope` alert prompting creator to grant both read-only scopes. |
| `no_refresh_token` | Google omitted `refresh_token` | Ensure `prompt=consent` & `access_type=offline` are active; creator can revoke at `https://myaccount.google.com/permissions` and reconnect. |
| `invalid_grant` | Refresh token revoked by user, or expired after 7 days while Google Consent Screen is in **Testing** status | Account is marked `RECONNECT_REQUIRED` automatically. Creator clicks **Reconnect YouTube** on `/creator/accounts`. |
| `accessNotConfigured` | YouTube Data API v3 or YouTube Analytics API disabled in GCP project `adzunova` | Enable both APIs in Google Cloud Console > APIs & Services > Library. |
| `quotaExceeded` | Project hit 10,000 units/day Data API quota | `YouTubeQuotaBudgeter` halts Data API calls and sets `next_sync_at` to next PT midnight (`getNextQuotaResetPT()`). |
| `insufficientPermissions` | Channel permission mismatch or Brand Account role insufficient | Creator must select the Brand Account owner/manager profile during consent. |
| `channelNotFound` (`no_channel`) | Selected Google account has no YouTube channel | Creator must create a channel or choose the Brand Account that owns it. |

---

## 2. Reading Render Logs
- Filter Render Web Service logs by `[YouTubeOAuthDebug]`, `[YouTubeCallback]`, `[YouTubeQuota]`, or `[YouTubeAlert]`.
- Every callback and error includes a `correlationId` (`support_id` in UI). All tokens (`ya29.*`, `1//*`) and secrets are scrubbed via `scrubSensitiveData()`.

---

## 3. Secret Rotation Procedures

### A. Rotating `YOUTUBE_CLIENT_SECRET`
1. Create a new client secret in Google Cloud Console > Credentials > **Adzunova YouTube Connect** (keep old secret active temporarily during rollout).
2. Update `YOUTUBE_CLIENT_SECRET` in Render Web Service environment variables and redeploy.
3. Verify new connects & token refreshes succeed, then delete the old client secret in Google Cloud Console.

### B. Rotating `TOKEN_ENCRYPTION_KEY` (`key_id` Envelope Re-Encryption)
1. Provision new 256-bit key in `TOKEN_ENCRYPTION_KEY` while keeping previous key mapped by `key_id` in the decryption keyring.
2. Run a background migration over `social_credentials` (`provider = 'youtube'`): decrypt with old `key_id`, re-encrypt with active `key_id`, update `token_ciphertext`, `token_nonce`, and `key_id` atomically.
3. Remove the retired key once 0 rows reference the old `key_id`.

---

## 4. Re-Running a Failed First Sync
1. Verify `FEATURE_YOUTUBE_SYNC` is not `'false'`.
2. Creator can click **Sync Now** on `/creator/accounts` (rate limited once per 15 minutes), or ops can trigger `POST /api/internal/social-sync` with `INTERNAL_CRON_SECRET`.
3. Emergency kill switches: set `FEATURE_YOUTUBE_CONNECT=false` or `FEATURE_YOUTUBE_SYNC=false` in Render to halt connect or background syncs immediately without redeploying code.
