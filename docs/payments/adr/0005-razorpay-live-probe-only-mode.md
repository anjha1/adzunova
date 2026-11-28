# ADR 0005: Razorpay Live-Probe-Only Mode (Owner Override)

**Date:** 2026-11-28
**Status:** Accepted (Owner Override)

## Context
Only live Razorpay keys (`rzp_live_*`) are currently available in `.env`. Test mode keys (`rzp_test_*`) are not yet provisioned. Running live money flows during development or automated testing is strictly forbidden.

## Decision
1. **Mode & Approval Gate:** Introduce `RAZORPAY_MODE=live_probe` paired with `RAZORPAY_LIVE_PROBE_APPROVED=true`. The Razorpay adapter refuses `rzp_live_*` keys in every other mode (except `RAZORPAY_MODE=live` with an audited owner-approval record in `pay_config_approvals`). An approval audit record (who, when, scope) is written to `pay_audit_events`.
2. **Strictly Allowed in `live_probe`:**
   - Create an order of the minimum allowed amount that is **never paid** (hard cap: max `10000` paise / ₹100 per order).
   - Fetch that order (read-only).
   - Verify signature math locally using generated test vectors.
   - Read-only fetches that move no money.
   - Enforced per-day call cap via `pay_daily_probe_counters`.
3. **Strictly Forbidden in `live_probe` (adapter must throw, proven by tests):**
   - Capturing or completing any payment.
   - Refunds, transfers / Razorpay Route, virtual account creation.
   - RazorpayX payouts, contacts, or fund accounts.
   - Registering webhooks to a production URL.
   - Any call from a user-facing request path (`FEATURE_PAYMENTS` remains `false` for users).
4. **Test Stubs:** Failed payments, late/duplicate webhooks, partial/overpayments, refund failures, payout failures, and reconciliation are developed against a `PaymentProviderPort` test stub built from official Razorpay documentation and recorded response shapes, inside test tooling only (CI-guarded against production imports).
5. **Go-Live Gate:** Every capability requiring a real payment, refund, payout, virtual account, or Route stays **UNVERIFIED (`needs Razorpay test mode`)** in ADR 0003/0004. M6 and M8 cannot be marked DONE, and the go-live gate stays **BLOCKED**, until the same scenarios pass against real Razorpay TEST mode keys.
6. **Secret & Log Hygiene:** Never print keys, signatures, or order secrets; log scans must prove zero leaks.
7. **Manual Owner Smoke Test:** At go-live, a single ₹1 live payment may be performed manually by the owner and documented in the go-live checklist; nothing automated may ever execute it.
