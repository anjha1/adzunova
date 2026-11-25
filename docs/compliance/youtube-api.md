# YouTube API Services Compliance & Limited Use Mapping

> **Policy References:**
> - Google API Services User Data Policy (Limited Use): https://developers.google.com/terms/api-services-user-data-policy
> - YouTube API Services Terms of Service: https://developers.google.com/youtube/terms
> - YouTube Developer Policies: https://developers.google.com/youtube/developer-policies

---

## 1. Rule-to-Code Compliance Matrix

| Compliance Requirement | Enforcing Code / Artifact |
|---|---|
| **Read-only access only (no write scopes, no monetary scope)** | `YOUTUBE_SCOPES` in [youtube-client.ts](file:///D:/Adzunova/apps/web/src/lib/social/youtube-client.ts) + `youtube-phase-2.test.mjs` + CI guard check |
| **Google Limited Use (no sale, no ads, no unauthorized transfer)** | Public disclosure in [privacy/page.tsx](file:///D:/Adzunova/apps/web/src/app/(marketing)/privacy/page.tsx); DTO allowlist in [serializer.ts](file:///D:/Adzunova/apps/web/src/lib/public-profile/serializer.ts) |
| **No generalized AI/ML model training on YouTube data** | `/creator/growth` ([growth/page.tsx](file:///D:/Adzunova/apps/web/src/app/creator/growth/page.tsx)) uses static pitch templates only; no YouTube API data is sent to any LLM/model provider |
| **Encrypted token vault & zero log leakage** | AES-256-GCM envelope encryption (`encryption.ts`) + `scrubSensitiveData()` (`ya29.`, `1//`, `key=`) in [log-scrubber.ts](file:///D:/Adzunova/apps/web/src/lib/social/security/log-scrubber.ts) |
| **Instant token revocation & metric deletion on disconnect** | `POST /api/creator/social-accounts/youtube/disconnect` ([disconnect/route.ts](file:///D:/Adzunova/apps/web/src/app/api/creator/social-accounts/youtube/disconnect/route.ts)) calls `oauth2.googleapis.com/revoke`, deletes `social_credentials`, marks `REVOKED`, and deletes stored metrics when requested |
| **Stale unrefreshed data retention bound (30 days)** | `purgeStaleRevokedYouTubeData()` in [social-repository.ts](file:///D:/Adzunova/apps/web/src/lib/social/social-repository.ts) purges metrics for accounts revoked >30 days |
| **Honest UI labels & Google/YouTube attribution** | `"Subscribers (as reported by YouTube)"`, `"Hidden by creator"`, `"Viewer age/gender (Google estimate)"`, `"Data through <date>"` in [latest-state.ts](file:///D:/Adzunova/apps/web/src/lib/social/latest-state.ts) & [analytics/page.tsx](file:///D:/Adzunova/apps/web/src/app/creator/analytics/page.tsx) |

---

## 2. Google Cloud Console Hygiene Checklist (Owner Action)

- [ ] Delete any unused OAuth 2.0 clients in project `adzunova`.
- [ ] On the production **Adzunova YouTube Connect** OAuth client, remove `localhost`, `onrender.com`, and OAuth Playground redirect URIs — keep only `https://adzunova.tech/api/auth/youtube/callback`.
- [ ] Verify the OAuth consent screen lists the exact same Privacy Policy (`https://adzunova.tech/privacy`) and Terms (`https://adzunova.tech/terms`) URLs linked from the homepage footer.
- [ ] Verify consent screen scopes list **only** `youtube.readonly` and `yt-analytics.readonly`.
- [ ] Confirm developer contact & support email addresses are current and monitored.
- [ ] Confirm no Cloudflare/anti-bot challenge blocks public pages (`/`, `/privacy`, `/terms`, `/c/[slug]`).
