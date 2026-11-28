# ADR 0004: KYC, Penny Drop & Payout Providers

**Date:** 2026-11-28
**Status:** Accepted (Pending Provider Onboarding in M7)

## Official Documentation References
- RazorpayX Payouts & Contacts/Fund Accounts: https://razorpay.com/docs/x/payouts/
- RazorpayX Fund Account Validation (Penny Drop): https://razorpay.com/docs/x/fund-account-validation/
- Razorpay Webhooks for Payouts: https://razorpay.com/docs/webhooks/payouts/

## Context
Phase 1 requires:
1. Creator KYC: PAN verification, ID proof (stored in private R2), and bank account ownership match via ₹1 penny drop.
2. One bank account linked to at most one creator (`unique` index on normalized `ifsc + accountNumberHash`).
3. 24-hour cooling-off period on newly added or changed bank accounts; 7-day hold on first payout.
4. Brand business verification (GSTIN / PAN / CIN) — already routed via `/api/brand/verify-business` to `identity-service`.

## Decision
1. Define `KycPort` and `PayoutPort` interfaces in the payments domain so providers can be swapped without changing business logic.
2. Target **RazorpayX** (`Contacts`, `Fund Accounts`, `Fund Account Validation` for ₹1 penny drop, and `Payouts` for IMPS/NEFT) as the primary Phase 1 payout & bank-validation adapter, pending RazorpayX onboarding/activation by the owner.
3. Target a dedicated India KYC verification adapter (PAN/GSTIN) behind `KycPort`, failing closed as `"Not configured"` when API keys are absent.
4. Store only masked PAN (`ABCDE****F`) and masked bank account (`****1234`) in read DTOs; encrypt sensitive identifiers at rest using AES-256-GCM envelope encryption (reusing the pattern in `apps/web/src/lib/social/security/encryption.ts`).

