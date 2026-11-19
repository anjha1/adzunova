# Creator Dashboard Hardcoded Data & Claims Audit

This document audits every file in `apps/web/src/app/creator/**` and `apps/web/src/components/creator/**` for hardcoded fake metrics, fake entities, fixed dates, unbacked claims, and hardcoded styling colors.

## Summary of Audit Findings

| Category | Description | Count / Scope |
|---|---|---|
| **Fake Brands / Entities** | "Nordic Audio Tech", "FitPro Nutrition", "Rohan Sharma", "Priya Patel", "Achhuta Creative" | Found in `affiliate`, `content`, `contracts`, `earnings`, `messages`, `referrals`, `trust`, `media-kit`, `profile` |
| **Fake Metrics / Stats** | `482.5K`, `1.24M`, `4.92%`, `94 / 100`, `98 / 100`, `85%`, `₹10,615,000`, `₹35,000` | Found in `analytics`, `media-kit`, `growth`, `trust`, `earnings`, `dashboard` |
| **Fixed Dates** | Hardcoded "November 2026", "Nov 17, 2026", "Nov 15, 2026", "Nov 10, 2026" | Found in `availability`, `earnings`, `contracts`, `content`, `messages`, `trust` |
| **Fixed Demographics** | "India 64%", "United States 18%", "18-24 years 42%" | Found in `analytics`, `media-kit` |
| **Unbacked Marketing Claims** | "GPT-4o Fine-Tuned", "100% Escrow Funded", "Statutory TDS Sec 194J", "Double-Entry Ledger Verified", "Encrypted communication" | Found in `growth`, `contracts`, `earnings`, `dashboard`, `support`, `subscription` |
| **Hardcoded Pricing / Plans** | "₹1,499 / month", "₹1,899", "2.0% Volume", hardcoded ₹85,000 / ₹45,000 / ₹35,000 | Found in `subscription`, `referrals`, `rate-card`, `packages` |
| **Hardcoded CSS Colors** | `bg-white`, `bg-black`, `bg-slate-*`, `text-slate-*`, `border-slate-*` | Over 110 instances in pages and shell components |

---

## Detailed File-by-File Audit

### 1. `apps/web/src/app/creator/dashboard/page.tsx`
- **Hard-coded values**:
  - `bg-white`, `bg-slate-50`, `bg-slate-900`, `text-slate-900`, `text-slate-500`, `border-slate-200` (Lines 28, 42, 60, 62, 69, 70, 73, 82, 85, 97, 99, 102, 106, 109, 114).
  - Unbacked claims: "Verified Escrow Guard", "escrow protected".
- **Action**: Replace colors with semantic tokens (`bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`). Wire counts to real DB or 0 if no records. Remove unbacked escrow claims.

### 2. `apps/web/src/app/creator/accounts/page.tsx`
- **Hard-coded values**:
  - Hardcoded colors: `bg-white`, `dark:bg-slate-900`, `border-slate-200`, `text-slate-900`, `text-slate-500` (Lines 52, 59, 60, 63, 67, 79, 86, 87, 94, 95, 99, 107, 110, 114, 115, 118, 122, 123, 126, 134, 137, 141, 142, 145, 149, 150, 153).
  - Stat cards: static values for verification ladder.
- **Action**: Replace with semantic tokens (`bg-card`, `border-border`, etc.). Verification ladder and social account statuses must come from real DB `social_accounts` or honest "Not connected" state.

### 3. `apps/web/src/app/creator/affiliate/page.tsx`
- **Hard-coded values**:
  - `DEFAULT_PROGRAMS` array containing "Nordic Audio Tech", "FitPro Nutrition", `totalClicks: 1420`, `conversions: 38`, `earnedMinorUnits: 2840000` (Lines 22-48).
  - StatCard values: `totalClicks`, `totalConversions`, `avgConversionRate` (Lines 69-95).
  - Claim: "Deterministic First-Party Cookie Tracking" (Line 101).
- **Required Real Source / Action**:
  - `affiliate_programs` / `affiliate_clicks` table in DB.
  - Since affiliate service does not exist yet: Show honest empty state: "No active affiliate programs available yet. Partner brands will list trackable commission offers here." Remove all fake brands and fake stats.

### 4. `apps/web/src/app/creator/analytics/page.tsx`
- **Hard-coded values**:
  - Top level metrics: `482.5K`, `4.92%`, `1.24M`, `94 / 100` (Lines 36, 42, 48, 54).
  - Hardcoded age breakdown: `18-24 years: 42%`, `25-34 years: 38%`, `35-44 years: 14%`, `45+ years: 6%` (Lines 70-75).
  - Hardcoded geographies: `India 64%`, `United States 18%`, `United Kingdom 9%`, `United Arab Emirates 5%` (Lines 94-98).
  - Hardcoded platform weight: `310K Subscribers`, `172.5K Followers` (Lines 119, 130).
  - Claim: "First-party verified metrics ingested via Google YouTube & Meta Graph OAuth" when no OAuth account has been synced.
- **Required Real Source / Action**:
  - Real source: `social_metrics` and `social_demographics` snapshots from real connected Instagram/YouTube accounts.
  - Fix: If no social account connected, show honest empty state: "No connected accounts. Connect your Instagram or YouTube account to ingest verified audience analytics." If connected, render real data points or "Awaiting first sync" if in progress. Never show fake curves or fake distributions.

### 5. `apps/web/src/app/creator/analytics/trends/page.tsx`
- **Hard-coded values**:
  - `TREND_DATA`: "AI Hardware & Snapdragon Laptops", "+140% QoQ", "Clean Protein & Clean-Label Supplements", "+88% QoQ", "Minimalist EDC & Desk Setups", "+65% QoQ" (Lines 14-36).
  - StatCards: "AI & Consumer Tech", "30-60s Reels", "Active Season" (Lines 50-68).
- **Required Real Source / Action**:
  - Real source: Aggregated marketplace category search trends from `search_events` or admin trend feed.
  - Fix: Show honest state: "Marketplace trend signals are updated weekly based on active brand campaign inquiries. Not enough category inquiry volume to compute trending topics yet." Remove all fake trend entries.

### 6. `apps/web/src/app/creator/availability/page.tsx`
- **Hard-coded values**:
  - Hardcoded "November 2026 Schedule" and hardcoded array of 30 days with fake "Tech Brand Shoot", "App Unboxing", "Creator Travel" (Lines 13-44, 132).
  - Hardcoded colors: `bg-slate-500/10`, `border-slate-600`, `bg-slate-50` (Lines 74, 219).
- **Required Real Source / Action**:
  - Fix: Dynamic calendar generated from the REAL CURRENT month and year (`new Date()`).
  - Dates load from `creator_availability` in DB; if empty, all days default to `available` with zero fake bookings.
  - Colors replaced with semantic tokens (`border-border`, `bg-muted`, etc.).

### 7. `apps/web/src/app/creator/campaigns/page.tsx`
- **Hard-coded values**:
  - Hardcoded claim: `subValue="100% escrow settled"` (Line 49).
  - Hardcoded colors: `bg-white`, `dark:bg-slate-900`, `border-slate-200`, `text-slate-900`, `text-slate-500` (Lines 70, 73, 74, 78).
- **Required Real Source / Action**:
  - Fix: Replace colors with semantic tokens. Real campaigns from DB; empty state when 0. Remove unbacked escrow guarantee claims.

### 8. `apps/web/src/app/creator/content/page.tsx`
- **Hard-coded values**:
  - `DEFAULT_ASSETS`: "Nordic Audio Tech", "fitpro_script_storyboard.pdf", "nordic_anc_review_master_v2.mp4", uploadedAt dates (Lines 20-56).
- **Required Real Source / Action**:
  - Real source: `campaign_deliverables` table in DB.
  - Fix: Empty array default with honest empty state: "No deliverables uploaded yet. Deliverables appear here when you are actively working on a brand campaign." Remove all fake assets.

### 9. `apps/web/src/app/creator/contracts/page.tsx`
- **Hard-coded values**:
  - `DEFAULT_CONTRACTS`: "ADZ-CTR-2026-9041", "Nordic Audio Tech", "FitPro Nutrition", `dealValueMinor: 6500000`, `dealValueMinor: 3500000`, `signedAt: 'Nov 16, 2026'` (Lines 20-43).
  - Claims: "100% Escrow Funded", "Protected Escrow Value", "Platform mediation included", "SHA256-DIGITAL-SIGN-CREATOR" (Lines 31, 41, 74, 82, 192).
- **Required Real Source / Action**:
  - Real source: `contracts` table in DB.
  - Fix: Empty array default with honest empty state: "No contracts yet. Agreements are generated when a brand accepts your rate card quote." Remove fake contracts and unbacked claims.

### 10. `apps/web/src/app/creator/earnings/page.tsx`
- **Hard-coded values**:
  - `INITIAL_LEDGER`: "TXN-ADZ-99104", "FitPro Nutrition", `availableMinorUnits: 3115000`, `escrowMinorUnits: 6500000`, `Lifetime Payouts: 10615000`, `Statutory TDS Deducted: 110000` (Lines 18-55, 62-65, 107-130).
  - Claims: "Double-entry financial accounting", "Statutory TDS Withholding (Sec 194J - 1%)", "Form 16A auto-generated" (Lines 29, 39, 100, 131).
- **Required Real Source / Action**:
  - Real source: `wallet_ledger` table in DB.
  - Fix: Empty ledger default with 0 balances: Available ₹0, In Escrow ₹0, Lifetime ₹0. Empty state: "No transactions yet. Completed campaign payouts and settlements will appear in your ledger." Remove unbacked claims about double-entry verification and TDS forms.

### 11. `apps/web/src/app/creator/growth/page.tsx`
- **Hard-coded values**:
  - "Profile Strength 85%", "Recommended Rate Lift +15% Base", "Audience Quality Tier: Tier 1 (Top 5%)", "GPT-4o Fine-Tuned", hardcoded pitch template (Lines 13-20, 48-66, 105).
- **Required Real Source / Action**:
  - Real source: Computed dynamically from profile completeness (avatar + bio + social accounts connected).
  - Fix: If no social account connected, Profile Strength computed honestly (e.g. 20% if only name filled, with specific missing items checklist). Rate lift shows "—" ("Connect accounts to analyze pricing"). Remove "GPT-4o Fine-Tuned" claim; label as standard template generator.

### 12. `apps/web/src/app/creator/media-kit/page.tsx`
- **Hard-coded values**:
  - "Achhuta Creative", "@achhutacreative", `482,500+`, `4.92%`, `94 / 100`, `1,240,000`, "18-34 years makes up 80%", "India (64%), US (18%), UK (9%)" (Lines 45-125).
  - Hardcoded colors: `bg-white/80`, `bg-black/30`, `bg-slate-900` (Lines 45, 54).
- **Required Real Source / Action**:
  - Real source: Logged in creator session (`displayName`, `avatarUrl`) and real connected `social_accounts` metrics.
  - Fix: Pull creator display name and handle from session. If no connected accounts, show honest "Not yet synced: Connect your Instagram or YouTube account to generate your live verified media kit." Remove all fake numbers and demographics.

### 13. `apps/web/src/app/creator/messages/page.tsx`
- **Hard-coded values**:
  - `INITIAL_CONVERSATIONS`: "Nordic Audio Tech", "FitPro Nutrition", fake chat messages, fake escrow lock messages (Lines 26-72).
- **Required Real Source / Action**:
  - Real source: `conversations` and `messages` table in DB.
  - Fix: Empty conversations list by default. Show honest empty state: "No active conversations. When a brand contacts you about a deal, your message thread will appear here."

### 14. `apps/web/src/app/creator/offers/page.tsx`
- **Hard-coded values**:
  - Already clean (uses empty offers array and honest empty state).
  - Needs verification of colors and claims.

### 15. `apps/web/src/app/creator/onboarding/page.tsx`
- **Hard-coded values**:
  - Needs audit of hardcoded colors (`bg-slate-50`, `bg-slate-950`, `bg-white`, `bg-slate-900`, `text-slate-900`, etc.).
- **Action**: Replace colors with semantic Tailwind tokens.

### 16. `apps/web/src/app/creator/packages/page.tsx`
- **Hard-coded values**:
  - `DEFAULT_PACKAGES`: "Omnichannel Launch Campaign", "Short-Form Viral Burst", `₹1,70,000`, `₹1,45,000`, `₹1,05,000`, `₹89,000` (Lines 19-48).
  - StatCards: `₹1,17,000`, "Omnichannel Launch" (Lines 94-114).
- **Required Real Source / Action**:
  - Real source: `creator_packages` in DB.
  - Fix: Default to empty packages array. Show honest empty state: "No packages created yet. Build combo packages to offer brands multi-channel bundles." Allow user to create real packages persisted in state/DB.

### 17. `apps/web/src/app/creator/profile/page.tsx`
- **Hard-coded values**:
  - Defaults: "Achhuta Creative", "achhutacreative", fake bio (Lines 10-18).
  - Hardcoded stat in preview: "Verified Reach: 482K" (Line 196).
- **Required Real Source / Action**:
  - Real source: User session profile from `GET /api/auth/me`.
  - Fix: Initialize form from session. In live preview, display "Verified Reach: — (Connect account to verify)" if no account is connected.

### 18. `apps/web/src/app/creator/rate-card/page.tsx`
- **Hard-coded values**:
  - `DEFAULT_RATES`: hardcoded base prices `₹85,000`, `₹45,000`, `₹35,000`, `₹15,000` (Lines 19-61).
  - StatCard: `Starting Rate: ₹15,000`, `Platform Commission: 10%`, `Avg Turnaround: 5-7 Days` (Lines 125-147).
- **Required Real Source / Action**:
  - Real source: `creator_rate_cards` in DB and `platform_config` via API.
  - Fix: When creator hasn't configured a rate card, show honest empty state / configuration prompt: "Set your custom deliverable pricing." Commission rate pulled from platform config or displayed as standard rate.

### 19. `apps/web/src/app/creator/referrals/page.tsx`
- **Hard-coded values**:
  - `REFERRED_CREATORS`: "Rohan Sharma", "Priya Patel", `bonusEarnedMinor: 480000`, `bonusEarnedMinor: 150000` (Lines 17-36).
  - StatCard: "Total Referral Bonus ₹6,300", "Referred Creators 2", "2.0% Volume" (Lines 60-84).
- **Required Real Source / Action**:
  - Real source: `referrals` table in DB.
  - Fix: Empty referrals array by default. StatCards show `₹0` bonus and `0` creators. Show honest empty state: "No referrals yet. Share your invite link to earn referral bonuses when creators join and complete deals."

### 20. `apps/web/src/app/creator/reviews/page.tsx` & `trust/page.tsx`
- **Hard-coded values**:
  - `REVIEWS`: "Nordic Audio Tech", "FitPro Nutrition", 5-star ratings, fake reviews (Lines 18-40).
  - StatCards: "Trust Score 98 / 100", "On-Time Delivery Rate 100%", "Brand Satisfaction 5.0 / 5.0", "Escrow Dispute Rate 0.0%" (Lines 50-74).
- **Required Real Source / Action**:
  - Real source: `creator_reviews` in DB and computed delivery statistics from completed campaigns.
  - Fix: If no completed deals, show "Trust Score: — (Not enough data)", "Delivery Rate: —", "Dispute Rate: —". Empty reviews state: "No brand reviews yet. Reviews are posted by verified brands after campaign completion."

### 21. `apps/web/src/app/creator/settings/page.tsx`
- **Hard-coded values**:
  - Fake PAN: "ABCDE****F", "Section 194J (Professional)" (Lines 47-53).
- **Required Real Source / Action**:
  - Real source: `creator_tax_info` in DB.
  - Fix: Show "PAN: Not provided", "Tax Status: Unverified" with CTA to submit KYC.

### 22. `apps/web/src/app/creator/subscription/page.tsx`
- **Hard-coded values**:
  - "₹1,499 / month", "₹1,899 / month", "Reduced 5% platform commission" (Lines 77-105).
- **Required Real Source / Action**:
  - Real source: `platform_config` / subscription plans API.
  - Fix: If pricing not yet configured in DB, display "Pricing plans are currently being finalized. Free creator access is active."

### 23. `apps/web/src/app/creator/support/page.tsx`
- **Hard-coded values**:
  - `INITIAL_TICKETS`: "TKT-ADZ-4412", fake resolved ticket (Lines 18-28).
  - StatCard: "Avg Resolution Time < 2 Hours" (Line 66).
- **Required Real Source / Action**:
  - Real source: `support_tickets` in DB.
  - Fix: Empty tickets list by default. StatCard shows "Resolution Time: Normal SLA (< 24 hrs)".

### 24. Shell & UI Components (`components/creator/**`)
- **Hard-coded values**:
  - `creator-sidebar.tsx`, `creator-header.tsx`, `mobile-bottom-nav.tsx`, `mobile-more-sheet.tsx`, `creator-shell.tsx`, `stat-card.tsx`, `empty-state.tsx`, `error-state.tsx`, `page-header.tsx`, `status-badge.tsx`.
  - Over 110 occurrences of hardcoded colors: `bg-white`, `bg-black`, `text-slate-*`, `bg-slate-*`, `border-slate-*`.
- **Action**: Replace with semantic tokens:
  - `bg-white` / `bg-slate-900` -> `bg-card` or `bg-background`
  - `text-slate-900` / `text-white` -> `text-foreground`
  - `text-slate-500` / `text-slate-400` -> `text-muted-foreground`
  - `border-slate-200` / `border-slate-800` -> `border-border`
  - `bg-slate-100` / `bg-slate-800` -> `bg-muted`
  - `border-slate-100` -> `border-border/60`
