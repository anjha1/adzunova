# Brand Creator Discovery API Contract (`GET /api/discovery/creators`)

This document defines the server API contract for brand discovery queries over verified creators. In accordance with standing platform rules, creators without a verified snapshot are strictly excluded from snapshot-based filter queries and are never assumed or fabricated.

---

## 1. Endpoint Specification

- **Method**: `GET`
- **Path**: `/api/discovery/creators`
- **Authentication**: Brand Session or Public Read Token
- **Rate Limit**: 60 requests/minute per IP/tenant

---

## 2. Query Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `platform` | `enum('instagram', 'youtube', 'all')` | No | `all` | Filter by connected verified social platform. |
| `min_followers` | `integer` | No | `0` | Minimum verified follower count. |
| `max_followers` | `integer` | No | - | Maximum verified follower count. |
| `min_18_plus_share` | `float (0.00 - 1.00)` | No | - | Excludes creators whose verified 18+ audience share is below this threshold (e.g. `0.85`). **Creators without real demographics snapshots are excluded.** |
| `max_13_17_share` | `float (0.00 - 1.00)` | No | - | Maximum acceptable 13–17 minor audience share (Meta estimate). **Creators without real demographics snapshots are excluded.** |
| `country` | `string (ISO-2)` | No | - | Top audience country code (e.g. `IN`, `US`). |
| `verified_only` | `boolean` | No | `true` | Only return creators with active `SOCIAL_VERIFIED` credentials. |
| `limit` | `integer (1 - 50)` | No | `20` | Pagination page size. |
| `cursor` | `string` | No | - | Opaque pagination cursor. |

---

## 3. Response Schema (JSON)

```json
{
  "data": [
    {
      "creatorId": "cr_01934f8a-9821-7294-8172-108273619283",
      "displayName": "Ananya Sharma",
      "avatarUrl": "https://images.adzunova.com/avatars/ananya.jpg",
      "verifiedStatus": "SOCIAL_VERIFIED",
      "primaryPlatform": "instagram",
      "socialProfile": {
        "provider": "instagram",
        "username": "ananyasharma_creates",
        "followersCount": 85400,
        "mediaCount": 240,
        "verifiedOn": "2026-11-19T14:30:00.000Z"
      },
      "audienceMetrics": {
        "hasSnapshot": true,
        "share_18_plus": 0.91,
        "share_13_17": 0.09,
        "share_18_34": 0.74,
        "dominantAgeBucket": "18-24",
        "genderKnownShare": 0.88,
        "topCountry": "IN",
        "audienceQualityScore": 88,
        "qualityStatus": "COMPLETE",
        "computedAt": "2026-11-19T14:30:00.000Z"
      },
      "rateCard": {
        "configured": true,
        "currency": "INR",
        "startingPriceMinorUnits": 1500000
      }
    }
  ],
  "pagination": {
    "hasMore": false,
    "nextCursor": null,
    "totalCount": 1
  }
}
```

---

## 4. Exclusion Policy for Unverified Creators
- If a brand specifies `min_18_plus_share=0.80`, any creator who has not connected their account or whose account has not yet produced a valid Meta demographics snapshot is **excluded** from results.
- Unverified creators are never given dummy or average numbers.
