# ADR 013: Meta Instagram Unified Login Architecture

## Status
Accepted

## Context
Adzunova requires direct, verified creator audience data (follower counts, impressions, demographics) from Instagram. Meta offers two integration flows:
1. Legacy Instagram Basic Display API (deprecated / sunset).
2. Instagram API with Unified Login (Facebook Login for Business with configuration ID).

## Decision
We adopted Meta's **Instagram API with Unified Login** utilizing `META_LOGIN_CONFIG_ID`.
- Authentication domain: `https://www.facebook.com/{GRAPH_API_VERSION}/dialog/oauth`
- API Endpoint: `https://graph.facebook.com/{GRAPH_API_VERSION}/`
- User token exchange yields long-lived tokens (`EA...`) valid for 60 days.
- App Secret Proof (`HMAC-SHA256`) is enforced on all Graph API calls.

## Consequences
- Requires creators to have an Instagram Business or Creator (Professional) account connected to a Facebook Page.
- Development mode is restricted to designated tester accounts until App Review completion.
- Provides access to professional `views` total_value and lifetime `follower_demographics`.
