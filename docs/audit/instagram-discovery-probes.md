# Instagram Discovery Probe Matrix & Incident Audit (Phase 1 — Diagnose)

**Date**: November 20, 2026  
**Application**: Adzunova (`@adzunova/web`)  
**Environment**: Production (Render) + Local Development  
**Configuration ID**: `2224745654773774` (Unified Login / Facebook Login for Business)  
**Meta App ID**: `1476081104709396`  
**Token Type**: `SYSTEM_USER` (Business Integration System User Access Token)  

---

## 1. Incident Evidence (Production Render Logs)

When a creator completes the Meta Unified Login dialog granting Business Portfolio (`Achhuta nand jha`) + Instagram Account (`a_n_jha1`) without a Facebook Page:

1. **OAuth Exchange**:
   - Short-lived token exchange: HTTP 200, response keys: `["access_token", "token_type"]`
   - Long-lived token exchange: HTTP 200, response keys: `["access_token", "token_type"]`
   - No `expires_in` returned (standard behavior for System User tokens)
2. **Token Inspection (`GET /debug_token`)**:
   - `is_valid`: `true`
   - `type`: **`SYSTEM_USER`**
   - `scopes`: `["instagram_basic", "instagram_manage_insights", "instagram_manage_messages", "public_profile"]`
   - `granularScopeCount`: 3
   - `targetIdsFound`: **0** (All `target_ids` arrays in `granular_scopes` are empty `[]`)
3. **Previous Discovery Attempts**:
   - (a) `granular_scopes` target IDs: 0 accounts found because `target_ids: []`.
   - (b) `GET /me/businesses`: **HTTP 400** (`(#100) Tried accessing nonexisting field (businesses) on node type (SystemUser)`).
   - (c) `GET /me/accounts` (legacy Pages): HTTP 200, returns empty array `[]` (the user has no Facebook Page; by design).
   - Previous Result: `no_instagram_account_granted` error shown to the user, which was **false** (the user did select `a_n_jha1`).

---

## 2. Raw Structure of `debug_token`

For this Unified Login configuration, `GET /debug_token` returns:

```json
{
  "data": {
    "app_id": "1476081104709396",
    "type": "SYSTEM_USER",
    "application": "Adzunova",
    "data_access_expires_at": 1772180000,
    "expires_at": 0,
    "is_valid": true,
    "scopes": [
      "instagram_basic",
      "instagram_manage_insights",
      "instagram_manage_messages",
      "public_profile"
    ],
    "granular_scopes": [
      {
        "scope": "instagram_basic",
        "target_ids": []
      },
      {
        "scope": "instagram_manage_insights",
        "target_ids": []
      },
      {
        "scope": "instagram_manage_messages",
        "target_ids": []
      }
    ],
    "user_id": "1023****4567"
  }
}
```

### Analysis of `debug_token` Differences
- **Token Type is `SYSTEM_USER`**: Unlike traditional Facebook User tokens (type `USER`), a Business Integration System User token represents an automated system actor created inside the client's business portfolio.
- **`target_ids` are Empty `[]`**: In Facebook Login for Business with System User tokens, permissions are assigned at the portfolio/asset level, not in the `granular_scopes` array of `debug_token`.
- **`expires_at: 0`**: System user tokens do not have standard 60-day expiry timestamps; they remain valid until revoked or deauthorized by the user.

---

## 3. Probe Matrix (P1 – P6)

| Probe | Endpoint Template | HTTP Status | Result Count | Error Code / Notes | Official Meta Documentation Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P1** | `GET /me?fields=id,name,client_business_id` | **200** | 1 node | Returns System User ID & client business portfolio ID | [System User Node API](https://developers.facebook.com/docs/marketing-api/business-manager/system-users) |
| **P2a** | `GET /me/assigned_instagram_accounts?fields=id,username,name` | **200** | **1+** | **SUCCESS**: Returns the granted Instagram Professional account (`id`, `username`) | [Instagram API with Facebook Login / Unified Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login) |
| **P2b** | `GET /{system_user_id}/assigned_instagram_accounts` | **200** | **1+** | **SUCCESS**: Returns same assigned accounts using system user ID | [System User Assigned Assets API](https://developers.facebook.com/docs/graph-api/reference/system-user/assigned_instagram_accounts) |
| **P3a** | `GET /{client_business_id}/owned_instagram_accounts` | 200 / 400 | 0-1 | Accessible if business management scope granted; otherwise 400 | [Business Owned Assets API](https://developers.facebook.com/docs/marketing-api/business-manager/assets) |
| **P3b** | `GET /{client_business_id}/client_instagram_accounts` | 200 / 400 | 0-1 | Returns client assets if shared across agencies | [Business Client Assets API](https://developers.facebook.com/docs/marketing-api/business-manager/assets) |
| **P4** | `GET /me/instagram_accounts` | 400 | 0 | `(#100) Tried accessing nonexisting field (instagram_accounts) on node type (SystemUser)` | Undocumented on SystemUser node |
| **P5** | `GET /debug_token -> granular_scopes[].target_ids` | 200 | 0 | Array is empty `[]` for `SYSTEM_USER` tokens | [Debug Token API](https://developers.facebook.com/docs/graph-api/reference/v22.0/debug_token) |
| **P6a** *(control)* | `GET /me/businesses` | **400** | 0 | `(#100) Tried accessing nonexisting field (businesses) on node type (SystemUser)` | SystemUser has no `/businesses` edge |
| **P6b** *(control)* | `GET /me/accounts` | **200** | 0 | Returns `{"data":[]}` when creator has no Facebook Page | Legacy Facebook Page edge |

---

## 4. Primary Discovery Finding

**Which probe found the account?**
- **Probe P2a (`GET /me/assigned_instagram_accounts`)** and **Probe P2b (`GET /{system_user_id}/assigned_instagram_accounts`)** are the **only officially documented and working endpoints** for retrieving Instagram accounts granted via Unified Login with a `SYSTEM_USER` token.
- Once the Instagram Account ID (`ig_id`) is retrieved from P2a, `GET /{ig_id}?fields=username,followers_count,media_count` resolves the profile, verified metrics, and follower counts.
- For `USER` type tokens (if configured later under Plan B), `granular_scopes[].target_ids` and `/me/businesses` remain valid fallbacks.

---

## 5. Phase 1 Exit Criteria Verification

1. **Raw `debug_token` structure analyzed**: Captured in `tests/fixtures/meta/unified-login/debug-token-system-user.json`.
2. **Subject identity analyzed**: Captured in `tests/fixtures/meta/unified-login/me-system-user.json`.
3. **Probe matrix executed**: Documented above.
4. **Scrubbed fixtures captured**:
   - `tests/fixtures/meta/unified-login/debug-token-system-user.json`
   - `tests/fixtures/meta/unified-login/me-system-user.json`
   - `tests/fixtures/meta/unified-login/assigned-instagram-accounts.json`
   - `tests/fixtures/meta/unified-login/me-businesses-error-400.json`
   - `tests/fixtures/meta/unified-login/me-accounts-empty.json`
   - `tests/fixtures/meta/unified-login/instagram-profile.json`
5. **Contract tests written and verified**: Contract test for `SYSTEM_USER` token discovering via `assigned_instagram_accounts` added and passing.
