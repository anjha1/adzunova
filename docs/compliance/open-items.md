# Compliance & Owner Sign-Off Open Items (Payment System Phase 1)

Items below require **CA, Legal, Provider Activation, or Owner** action before moving from Test Mode to Live Money.

| # | Area | Open Item | Owner | Blocking Live Money? |
|---|---|---|---|---|
| 1 | **RBI / Nodal / Escrow** | Confirm RBI Payment Aggregator / Marketplace nodal compliance with Lawyer & CA; activate **Razorpay Route** (linked accounts + transfer-on-hold) or Cashfree Marketplace. | Owner + CA/Lawyer | **YES** |
| 2 | **GST Treatment** | Confirm with CA whether GST (18%) applies on `(Deliverable Total + Brand Fee)` vs platform fee only when creator is unregistered vs GST-registered, and invoice/credit-note format. | CA | **YES** |
| 3 | **TDS (Section 194J / 194C / 194O)** | Confirm applicable TDS section, threshold, PAN-missing higher rate (20%), and Form 16A filing cadence. | CA | **YES** |
| 4 | **Razorpay Test Keys** | Provision `RAZORPAY_KEY_ID` (`rzp_test_*`), `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in `.env.local` for M4+ integration tests. | Owner | Blocks M4+ live gateway probes |
| 5 | **RazorpayX / Payouts & Penny Drop** | Complete RazorpayX onboarding for test/live IMPS/NEFT payouts and ₹1 penny-drop bank account verification. | Owner | Blocks M7 live payout probes |
| 6 | **KYC Provider** | Select and provision PAN/GSTIN/ID verification provider (e.g., Cashfree Verification Suite / Karza / Signzy / Razorpay). | Owner | Blocks M7 live KYC probes |
| 7 | **Agreement Template & Non-Circumvention** | Legal review of auto-generated collaboration agreement PDF, 12-month non-circumvention clause, IP transfer/license terms, and OTP e-sign enforceability (IT Act 2000). | Lawyer | **YES** |
| 8 | **DPDP Act Privacy** | Verify consent capture, PAN/bank masking in UI, encrypted KYC storage, and retention/deletion policy. | Lawyer / Owner | **YES** |
| 9 | **Hard Prerequisites (M3)** | Creator Packages (`/creator/packages`) and Availability (`/creator/availability`) currently have UI-only `useState` with no backend persistence. Must be backed by persisted APIs before M3 bookings. | Engineering / Owner | Blocks M3 |

