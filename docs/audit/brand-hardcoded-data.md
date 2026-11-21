# Adzunova Brand Side — Truth Audit of Hard-Coded Data & Unbacked Claims

Audit Date: 2026-11-21  
Scope: `apps/web/src/app/brand/**`, `apps/web/src/components/brand/**`, `apps/web/src/app/(marketing)/auth/brand/**`, `services/identity-service/**`

---

## 1. Executive Summary

A comprehensive code audit was conducted on the Brand portal (`/brand/dashboard`, `/brand/onboarding`, `/auth/brand/**`) to identify all hard-coded values, false/unbacked claims, marketing numbers, fake verification statuses, and styling anti-patterns (such as hard-coded color utilities).

All identified items are cataloged below with their root cause, risk profile, and required enterprise-grade remediation.

---

## 2. Inventory of Audited Claims and Hard-Coded Data

| File & Location | Current Hard-Coded Text / Claim | Why It Is Invalid / False | Required Source / Remediation |
| :--- | :--- | :--- | :--- |
| `app/brand/dashboard/page.tsx:28` | `<Logo badgeText="ENTERPRISE" />` | Static "ENTERPRISE" badge displayed regardless of subscription tier. | Wire to real `workspace.subscriptionPlan` or `profile.planTier`. Default to `"BRAND"` or no plan badge. |
| `app/brand/dashboard/page.tsx:37` | `{user.emailVerified ? 'Corporate Verified' : 'Pending Verification'}` | False verification claim: verifying an email does not verify corporate identity, GST, PAN, or CIN. | Wire to real `profile.verificationStatus`. Only show `'Verified Business'` if proven via business documents / domain TXT. Default: `'Unverified Business'`. |
| `app/brand/dashboard/page.tsx:60` | `"Launch creator discovery campaigns... and automate escrow."` | Unbacked claim: custodial escrow does not exist on Adzunova. | Remove "automate escrow". Replace with honest description: `"Launch creator discovery campaigns, manage proposals, track deliverables, and coordinate campaign execution."` |
| `app/brand/dashboard/page.tsx:76-80` | Card: `"Escrow Allocated"`, `"$0.00"`, `"Institutional custodial protection"` | Custodial protection does not exist; currency is hard-coded to USD (`$`). | Replace with `"Allocated Budget"`, formatted with real workspace billing currency (`workspace.currency \|\| 'INR'`), subtext: `"Campaign budget committed"`. |
| `app/brand/dashboard/page.tsx:84-88` | Card: `"Contracted Creators"`, subtext: `"Search 25,000+ verified talent"` | "25,000+" is an invented marketing number. | Query real count of published, verified creators from database via `getActiveVerifiedCreatorCount()`. Label: `"Creators on Adzunova with verified data"`. |
| `app/brand/dashboard/page.tsx:98` | `{profile?.industry \|\| 'Enterprise'}` | "Enterprise" used as hardcoded fallback for industry vertical. | Replace with `{profile?.industry \|\| 'Unspecified'}`. |
| `app/brand/dashboard/page.tsx:124` | Button: `"Update Enterprise Profile"` | "Enterprise Profile" is misleading for standard brand accounts. | Replace with `"Company Profile & Setup"`, pointing to onboarding/settings. |
| `app/brand/dashboard/page.tsx:130` | Button: `"Read Brand Playbook"` | "Playbook" has no real destination (redirects to generic landing page `/for-brands`). | Replace with `"Discover Creators"`, routing to discovery `/brand/discover` or talent listings. |
| `app/brand/dashboard/page.tsx:23-134` | `bg-slate-50`, `bg-white`, `border-slate-200`, `text-slate-900`, `text-emerald-600`, etc. | Hardcoded color utilities break dark/light theme tokens and fail CI Guard (a). | Refactor completely to semantic tokens (`bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`). |
| `services/identity-service/.../identity-application-service.ts:322` | `companyName: `${input.name}'s Company`` | Automatically generated name creates ugly placeholders like `"ACHHUTA NAND JHA's Company"`. | Set `companyName: ''` on signup, prompting the user to establish real registered company name during onboarding. |
| `app/brand/onboarding/page.tsx:19, 226-230` | Target Budget: `'$10k - $50k / month'`, `'<$10k / month'`, `'$200k+ / month (Enterprise)'` | Hardcoded USD amounts and static "(Enterprise)" tag. | Localize to INR (or workspace currency): `< ₹1,00,000 / month`, `₹1,00,000 - ₹5,00,000 / month`, `₹5,00,000 - ₹20,00,000 / month`, `₹20,00,000+ / month`. |
| `app/brand/onboarding/page.tsx:97, 87` | `"Verifying enterprise session..."`, `"Failed to save enterprise profile."` | Overuse of "enterprise" string. | Replace with `"Verifying brand session..."` and `"Failed to save company profile."`. |
| `app/brand/onboarding/page.tsx:104-250` | `bg-slate-50`, `bg-white`, `border-slate-300`, `text-slate-700`, etc. | Hardcoded color classes violating CI Guard (a). | Convert all inputs, cards, and buttons to semantic design system classes. |
| `app/(marketing)/auth/brand/sign-up/page.tsx:99` | Subtitle: `"...and protect funds with milestone escrow."` | Unbacked claim regarding escrow. | Replace with `"...and coordinate deliverables with milestone-based approvals."` |

---

## 3. CI Guard Enforcement Strategy

The existing CI guard script (`scripts/ci-guards.mjs`) is extended to include both `apps/web/src/app/brand` and `apps/web/src/components/brand`.

The deny-list is expanded with brand-specific forbidden strings:
- `'25,000'`
- `'Corporate Verified'`
- `'Institutional'`
- `'custodial'`
- `'Enterprise'` (checked for static text usage)
- `'Playbook'`
- `'Coming soon'`
- `'demo'`
- `'mock'`

Any PR or commit containing these terms or hardcoded colors will fail the CI pipeline immediately.
