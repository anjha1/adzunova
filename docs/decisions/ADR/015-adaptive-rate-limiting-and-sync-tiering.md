# ADR 015: Adaptive Rate Limiting & Tiered Scheduling

## Status
Accepted

## Context
At scale (100M+ accounts), calling the Meta Graph API on page views is unfeasible and triggers aggressive upstream rate limiting.

## Decision
1. **Zero Meta Calls on Page Views**: Reads are served exclusively from local databases and read replicas.
2. **Tiered Sync Cadence**:
   - `HOT` (Active campaigns or login within 48h): every 4 to 6 hours.
   - `WARM` (Standard verified creators): every 24 hours.
   - `COLD` (Inactive $>30$ days or failing accounts): every 7 days.
3. **Adaptive Rate-Limiting**: Response headers `x-app-usage` and `x-business-use-case-usage` are parsed dynamically. Throttling is engaged at $\ge 90\%$ utilization.
4. **Circuit Breaker**: Trips to `OPEN` state upon consecutive failures or throttling error codes (`4`, `17`, `32`, `613`), halting calls during upstream incidents.
5. **Jitter Distribution**: Schedules apply $\pm 15\%$ random jitter to prevent thundering herds.

## Consequences
- Protects platform-wide Graph API quota.
- Shields users from upstream latency.
