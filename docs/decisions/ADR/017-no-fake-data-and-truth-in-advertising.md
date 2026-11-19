# ADR 017: No Fake Data & Truth in Creator Marketplace Advertising

## Status
Accepted

## Context
Marketplace platforms often use sample mock numbers, unbacked badges, or hardcoded dates during development. In an advertising marketplace, inaccurate metrics violate trust, breach advertiser agreements, and violate ASCI / FTC guidelines.

## Decision
1. **Real Data Only**:
   - Empty database rows = honest empty state.
   - Missing configurations = `"Not configured"`.
   - Incomplete metrics = `"Not available: <reason>"`.
2. **Exclusion of Unverified Entities**:
   - In brand discovery queries (`GET /api/discovery/creators`), creators without a real verified snapshot are strictly excluded from demographic filter results; numbers are never assumed.
3. **Audience Quality Score Rules**:
   - Calculated strictly from available empirical data points.
   - If any factor is missing, the score is labeled `PARTIAL` with missing factors explicitly listed, or displayed as `"Not enough data"`.
4. **CI Enforcement**:
   - Automated CI guards verify that no mock imports, hardcoded colors, or deny-list marketing claims (`fine-tuned`, `zero-risk`, `98/100`) can be committed.

## Consequences
- Every badge, metric, and percentage shown to creators and brands is backed by a verified database row or authentic API response.
