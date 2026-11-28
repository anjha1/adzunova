# ADR 0003: Razorpay Capabilities & Test-Mode Findings

**Date:** 2026-11-28
**Status:** Accepted (Pending Test-Key Probes in M4)

## Official Documentation References
- Orders API: https://razorpay.com/docs/api/orders/
- Payments & Capture: https://razorpay.com/docs/api/payments/
- Refunds API: https://razorpay.com/docs/api/refunds/
- Webhooks & Signature Verification: https://razorpay.com/docs/webhooks/validate-test/
- Razorpay Route (Marketplace Linked Accounts & On-Hold Transfers): https://razorpay.com/docs/payments/route/
- Smart Collect / Virtual Accounts (NEFT/RTGS/IMPS): https://razorpay.com/docs/payments/smart-collect/

## Findings
1. **Standard Checkout + Orders + Webhooks + Refunds:** Available immediately with `rzp_test_*` keys. Supports UPI, Cards, Netbanking. Webhook signature is `X-Razorpay-Signature` = HMAC-SHA256 over the **raw request body** using `RAZORPAY_WEBHOOK_SECRET`.
2. **Razorpay Route (Marketplace Hold / Nodal Settlement):** Required to hold marketplace funds on-hold (`on_hold: 1`) in RBI-compliant nodal/linked accounts rather than Adzunova's operating account. **Requires explicit Route product activation** on the Razorpay merchant account; not enabled by default on standard test accounts.
3. **Virtual Accounts (Bank Transfer):** Smart Collect / Virtual Accounts also require product activation on the Razorpay account.
4. **Current Repo State:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` are **not yet configured** in `.env.local`.

## Decision
1. Implement `PaymentGatewayPort` with a `RazorpayGatewayAdapter` for Orders, Payment verification, Webhooks (raw-body HMAC-SHA256 + replay protection), and Refunds.
2. Probe real test endpoints once owner provides `rzp_test_*` keys in `.env.local` and store scrubbed fixtures under `tests/fixtures/razorpay/`.
3. Until Route activation is confirmed and probed, UI copy must say `"Payment received; work can start"` rather than `"escrow protected"`.
4. Enforce a fail-closed live-key guard: refuse any `rzp_live_*` key unless `RAZORPAY_MODE=live` AND an audited owner-approval record exists.

