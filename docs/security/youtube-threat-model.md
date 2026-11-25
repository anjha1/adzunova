# YouTube Integration — Security Threat Model

| Threat | Mitigation in Code | Verification |
|---|---|---|
| **CSRF on Connect / Disconnect** | `connect` uses 192-bit CSPRNG `state` bound to `creatorId` + `sessionId` (`oauth-state.ts`); `disconnect` verifies `Origin` header matches `getPublicOrigin(req)`. | `youtube-threat-model.test.mjs` |
| **State Fixation & Replay** | `validateAndConsumePersistentOAuthState()` atomically deletes state (`findOneAndDelete` / `Map.delete`) on first use and validates with `crypto.timingSafeEqual`. | `youtube-phase-2.test.mjs`, `youtube-threat-model.test.mjs` |
| **Authorization Code Interception** | PKCE `S256` (`code_challenge` + server-side `code_verifier`) on every OAuth exchange. | `youtube-phase-2.test.mjs` |
| **Open Redirect** | Connect and callback routes construct redirects exclusively via `new URL('/creator/accounts...', origin)` where `origin = getPublicOrigin(req)` — user-supplied redirect URLs are never followed. | `youtube-threat-model.test.mjs` |
| **Token Theft / Plaintext Storage** | Refresh tokens encrypted at rest via AES-256-GCM (`encryption.ts`) with `key_id`; `getSocialAccountsByCreatorId()` never projects `social_credentials`. | `social-security.test.mjs` |
| **Log Leakage** | `scrubSensitiveData()` redacts `ya29.*`, `1//*`, `access_token=`, `refresh_token=`, `client_secret=`, `key=`, `code=`; `DEBUG_OAUTH` defaults to `false`. | `log-scrubber-audit.test.mjs`, `youtube-phase-2.test.mjs` |
| **Cross-Creator Channel Takeover** | `UNIQUE(provider, provider_user_id)` + `saveSocialAccountAndCredentials()` rejects claiming an `ACTIVE` channel owned by another creator (`account_already_linked`). | `social-security.test.mjs` |
| **SSRF** | Zero user-supplied URLs fetched by server; all outbound requests target fixed `https://accounts.google.com`, `https://oauth2.googleapis.com`, `https://www.googleapis.com`, `https://youtubeanalytics.googleapis.com`. | Code review + `youtube-client.ts` |
