# ADR 018: Mitigation and Architectural Boundary for Mandatory `instagram_manage_messages` Permission

## Status
Accepted

## Context
In Meta Unified Login (Facebook Login for Business) configuration ID `2224745654773774`, Meta enforces `instagram_manage_messages` as a required, non-removable permission alongside `instagram_basic` and `instagram_manage_insights`. In the Meta App Dashboard, attempt to deselect or remove `instagram_manage_messages` is disallowed by the configuration UI.

Consequently, any OAuth consent grant issued under this configuration includes `instagram_manage_messages` in the granted scopes. However, Adzunova is strictly an advertising marketplace for verified reach and sponsorship rate cards. Adzunova has zero product requirement to read, write, send, or manage Instagram Direct Messages (DMs).

Carrying a sensitive messaging permission without clear isolation introduces potential App Review scrutiny from Meta, compliance liabilities under GDPR / DPDP Act, and user confusion during authorization.

## Decision

We establish a strict, multi-layered architectural boundary and audit policy:

1. **Static CI Guardrails (`scripts/ci-guards.mjs`)**:
   - Automated CI Guard (e) scans all codebase files in `apps/web/src/**`.
   - The build fails immediately if any Graph API messaging endpoint (`/conversations`, `/messages`, `/threads`, `/inbox`) or messaging webhook topic (`message_reactions`, `messaging_postbacks`, `messaging_optins`, `messaging_referral`, `messaging_seen`, `message_reads`, `message_echoes`, `standby`) is referenced.

2. **Zero Webhook Subscriptions**:
   - Adzunova does not subscribe to any messaging webhook events in the Meta App Dashboard.
   - The platform webhook handlers only process account deauthorization (`POST /api/auth/instagram/deauthorize`) and user data deletion requests (`POST /api/auth/instagram/data-deletion`).

3. **Truthful Consent & Privacy Disclosures**:
   - The consent page (`/creator/me/social-accounts/instagram/consent`) and privacy policy (`/privacy`) explicitly state:
     *"Adzunova reads profile counts, insights and audience demographics only; it does not read or send messages. Although Meta Login configuration requires the `instagram_manage_messages` permission, Adzunova never reads, sends, or processes direct messages (DMs) or inbox threads."*
   - We do not falsely claim Meta cannot grant this access; rather, we truthfully disclose that our platform refuses and prohibits all message access.

4. **Data Minimization & Schema Isolation**:
   - Database schemas (`creator_social_accounts`, `creator_audience_insights`) store only aggregated profile statistics, views, and demographic buckets.
   - Zero tables, columns, or cache keys exist for messages, message metadata, conversation threads, or recipient IDs.

5. **Mandatory Deauthorization and Deletion Handlers**:
   - In accordance with Meta Platform Terms, deauthorization and data deletion callbacks are cryptographically verified with constant-time HMAC-SHA256 signatures, immediate credential purging, and publicly trackable confirmation codes.

## Consequences
- **Positive**: Complete compliance with Meta Platform Terms, GDPR, and DPDP Act. Zero exposure to messaging data or DM eavesdropping risks.
- **Positive**: Automated static analysis prevents developers from accidentally integrating messaging endpoints.
- **Maintenance**: During Meta App Review, this ADR and the CI guard log serve as verifiable evidence that the app does not request or process messaging payloads despite the configuration lock.
