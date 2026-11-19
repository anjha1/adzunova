# Meta Platform Terms & Compliance Architecture

This document formalizes Adzunova's implementation of Meta Platform Terms, Developer Policies, and international data protection standards (India Digital Personal Data Protection Act 2023, GDPR, CCPA).

---

## 1. Compliance Matrix: Meta Platform Terms & Developer Policies

| Meta Platform Policy Section | Requirement | Adzunova Implementation | Enforcement Location |
| :--- | :--- | :--- | :--- |
| **Section 3.a: Data Minimization** | Only request permissions and platform data strictly required for the feature. | Application requests only `instagram_basic` and `instagram_manage_insights`. Probed capabilities restrict reads to public follower counts, aggregate 24h views, and aggregate lifetime demographics. No permissions for direct messages, feed publishing, or ad management are requested for analytics. | `apps/web/src/lib/social/meta-client.ts`<br>`apps/web/src/lib/social/sync-worker.ts` |
| **Section 3.b: Commercial Exploitation Prohibition** | Never sell, license, or purchase platform data. | Adzunova acts solely as a data processor for the creator. Metrics are never sold to data brokers or third-party ad networks. Platform data is displayed in aggregated format exclusively to verified brand advertisers considering creator sponsorship deals. | Privacy Policy Section 4<br>`apps/web/src/app/(marketing)/privacy/page.tsx` |
| **Section 3.c: Surveillance & Profiling** | Do not conduct surveillance or use platform data for discriminatory profiling. | Individual followers are never tracked, scraped, or profiled. Demographics data is strictly macro-aggregated by Meta. Minor demographics (13–17) are labeled neutrally as *"share of followers aged 13–17 (Meta estimate)"* and cannot be used for discriminatory filtering. | `apps/web/src/lib/social/demographics-engine.ts` |
| **Section 4.a: Security & Credential Protection** | Protect access tokens, secrets, and private keys with industry-standard encryption. Plaintext storage and logging are strictly prohibited. | Envelope encryption (AES-256-GCM) with 96-bit initialization vectors and separate `social_credentials` storage. Automated log scrubbers redact tokens (`access_token=`, `EA...`) and secrets from all server logs, traces, and error messages. Paging URLs are scrubbed before storage. | `apps/web/src/lib/social/security/encryption.ts`<br>`apps/web/src/lib/social/security/log-scrubber.ts`<br>`apps/web/src/lib/social/security/meta-signature.ts` |
| **Section 4.b: Rate Limit & API Hygiene** | Adhere to API rate limits; do not circumvent throttling or degrade Meta infrastructure. | Evaluates `x-app-usage` and `x-business-use-case-usage` headers on every response. Throttles proactively at 90% utilization. Implements circuit breaker (CLOSED/OPEN/HALF_OPEN) with exponential backoff on error codes `4`, `17`, `32`, and `613`. Applies $\pm 15\%$ schedule jitter to prevent thundering herds. | `apps/web/src/lib/social/rate-limiter.ts`<br>`apps/web/src/lib/social/sync-worker.ts` |
| **Section 5.a: Deauthorize Callback** | Support webhook notifying when a user removes the application in Facebook settings. | Route handler validates Meta's HMAC-SHA256 `signed_request`, unlinks account, deletes all encrypted credentials, and marks account `REVOKED`. Replay protection prevents forged duplicate requests. | `apps/web/src/app/api/auth/instagram/deauthorize/route.ts` |
| **Section 5.b: User Data Deletion Callback** | Provide callback and public confirmation tracking page for automated user data deletion requests. | Webhook verifies signature, purges user metrics and tokens, creates a tracked deletion receipt, and returns `{ url, confirmation_code }`. The public endpoint `/data-deletion-status?code={code}` allows real-time status verification. | `apps/web/src/app/api/auth/instagram/data-deletion/route.ts`<br>`apps/web/src/app/data-deletion-status/page.tsx` |

---

## 2. Retention Policy by Data Classification

| Data Class | Stored Data | Retention Period | Deletion Trigger |
| :--- | :--- | :--- | :--- |
| **OAuth Credentials** | AES-256-GCM encrypted long-lived user access tokens | Valid for up to 60 days; rotated automatically or purged immediately on revoke. | Account disconnect, Deauthorize callback, User deletion request. |
| **Public Profile Metadata** | Instagram ID, username, profile picture (mirrored), bio snippet, follower count, media count | Retained while account is `ACTIVE`. | Disconnect or deletion. |
| **Time Series Metrics** | Daily view counts, follower progression snapshots | 13 months at full daily granularity; rolled up to monthly aggregates thereafter. | Disconnect (user option: purge immediately or preserve historical portfolio). |
| **Audience Demographics** | Macro-aggregated percentages for 7 age buckets, gender breakdown, and top countries | Replaced weekly upon new sync; historical snapshots kept for 6 months. | Disconnect or deletion. |
| **Audit Logs** | Timestamp, action, provider, IP hash, status | 24 months for regulatory compliance and dispute resolution. | Automated TTL expiration. |

---

## 3. Transparency & Creator Consent Workflow

Before redirecting any creator to Meta's Unified Login OAuth dialog:
1. **Explicit Permission Breakdown**:
   - Discloses exactly what will be read (Follower count, 24h Views total_value, aggregate Age/Gender/Country distributions).
   - Discloses what is **never** accessed (DMs, private photos, comments, individual follower identities).
2. **Audience Demographics Disclosure**:
   - Explicit notification that age distribution is estimated by Meta models and that the 13–17 bracket represents estimated teenage followers.
3. **Revocation Notice**:
   - Informs the creator that they can disconnect at any time from `/creator/accounts` or directly from Facebook Settings > Apps & Websites.

---

## 4. Compliance URLs for Meta App Dashboard

- **Privacy Policy URL**: `https://adzunova-web.onrender.com/privacy`
- **Terms of Service URL**: `https://adzunova-web.onrender.com/terms`
- **User Data Deletion Callback URL**: `https://adzunova-web.onrender.com/api/auth/instagram/data-deletion`
- **Data Deletion Instructions URL**: `https://adzunova-web.onrender.com/data-deletion`
- **Data Deletion Status URL**: `https://adzunova-web.onrender.com/data-deletion-status`
- **Deauthorize Callback URL**: `https://adzunova-web.onrender.com/api/auth/instagram/deauthorize`
