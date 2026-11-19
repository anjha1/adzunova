# Instagram & Social Data Pipeline Operational Runbooks

This guide outlines critical incident response procedures, operational SLO monitoring, alerting rules, and secret rotation playbooks for Adzunova's social integration pipeline.

---

## 1. Operational SLOs & Monitoring Metrics

| Metric | Target / Threshold | Alert Severity | Action |
| :--- | :--- | :--- | :--- |
| **Sync Freshness (HOT Tier)** | p95 < 6 hours | Warning (if > 8h) | Check worker pool queue depth and Meta Graph API error rates. |
| **Sync Freshness (WARM Tier)** | p95 < 28 hours | Warning (if > 36h) | Scale worker consumer shards. |
| **Graph Rate-Limit Utilization** | < 85% average | Critical (if >= 90%) | Automated adaptive throttle engages; inspect top consumer accounts. |
| **Invalid Token Spike Rate** | < 1% per hour | Critical (if > 5% / 15m) | Indicates mass token revocation or Meta app permission invalidation. |
| **Connect Flow Response Time** | p95 < 2s (excluding Meta redirect) | Warning (if > 4s) | Check database connection pool and Redis latency. |
| **Circuit Breaker Status** | State == `CLOSED` | Critical (if `OPEN` > 5m) | Meta Graph API outage or IP ban. |

---

## 2. Incident Runbooks

### Runbook 1: Meta Graph API Outage or 429 Storm
- **Symptom**: Elevated `RATE_LIMITED` (code 4, 17, 32, 613) or `TRANSIENT_ERROR` (code 1, 2, 5xx) errors.
- **Automated Behavior**:
  1. Circuit breaker trips to `OPEN` state after 3 consecutive failures.
  2. Workers suspend outbound calls for the backoff duration (base 5s up to 5m).
  3. `next_sync_at` timestamps are deferred with exponential backoff and $\pm 15\%$ jitter.
- **Manual Intervention**:
  1. Check [Meta Status Dashboard](https://metastatus.com/) for platform-wide outages.
  2. If localized to our App ID: inspect `x-app-usage` and `x-business-use-case-usage` logs.
  3. Engage load shedding: temporarily suspend `COLD` and `DEMOGRAPHICS` queues to prioritize active campaign `HOT` creators.

### Runbook 2: Mass Token Invalidation (Error 190)
- **Symptom**: Alert fires for `SocialTokenInvalid` rate spike > 5% in 15 minutes.
- **Root Causes**:
  - Meta App permissions changed or App Review status altered.
  - User mass password reset or security revocation on Facebook.
  - Expired long-lived tokens (~60-day window elapsed without refresh).
- **Procedure**:
  1. Verify Meta App Review and Developer Dashboard status.
  2. Accounts with Error 190 are automatically updated to `status = 'RECONNECT_REQUIRED'`.
  3. Automated retry loop is terminated immediately to prevent IP blacklisting.
  4. Trigger email and in-app Action Center notification to affected creators: *"Your Instagram connection has expired. Reconnect in Settings to restore verified analytics."*

### Runbook 3: Secret Rotation Playbook

#### A. Rotating `TOKEN_ENCRYPTION_KEY`
The encryption layer (`apps/web/src/lib/social/security/encryption.ts`) supports envelope encryption with `keyId` versioning (`key_id = 'v1'`, `'v2'`).
1. Generate a new cryptographically secure 256-bit base64 key:
   ```bash
   node -e "console.log(crypto.randomBytes(32).toString('base64'))"
   ```
2. Deploy the new key as `TOKEN_ENCRYPTION_KEY_V2`.
3. Update encryption service to tag new writes with `keyId: 'v2'` while decrypting existing rows with `v1`.
4. Run the re-encryption background migration job to rotate existing ciphertext in `social_credentials`.
5. Deprecate and remove `v1` key once all rows are migrated.

#### B. Rotating `META_APP_SECRET`
1. Go to **Meta App Dashboard > App Settings > Basic > App Secret**.
2. Click **Rotate App Secret**. Meta provides a 24-hour overlapping grace period where both old and new secrets are valid.
3. Update `META_APP_SECRET` in environment variables on Render.
4. Verify signature verification passes on `/api/auth/instagram/deauthorize` and `/api/auth/instagram/data-deletion`.

### Runbook 4: Handling Data Deletion Requests
1. Requests received via `/api/auth/instagram/data-deletion` generate a unique `confirmation_code` (`del_<hex>`).
2. Immediate automated actions:
   - Account credentials in `social_credentials` are deleted (`DELETE`).
   - `social_accounts` record is marked `status = 'REVOKED'`.
   - `social_data_deletion_requests` record is marked `COMPLETED`.
3. Creators or Meta auditors can verify status at `https://adzunova-web.onrender.com/data-deletion-status?code={confirmation_code}`.

---

## 3. Architecture Decision Records (ADRs)

The corresponding ADRs documenting these design choices are indexed under:
- `docs/decisions/ADR/013-meta-unified-login-oauth.md`
- `docs/decisions/ADR/014-envelope-encryption-and-token-vault.md`
- `docs/decisions/ADR/015-adaptive-rate-limiting-and-sync-tiering.md`
- `docs/decisions/ADR/016-clickhouse-time-series-and-retention.md`
- `docs/decisions/ADR/017-no-fake-data-and-truth-in-advertising.md`
