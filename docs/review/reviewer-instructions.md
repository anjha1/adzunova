# Google OAuth Verification — Reviewer Test Instructions

## Overview
Adzunova (`https://adzunova.tech`) is a creator–brand sponsorship marketplace. Creators connect their YouTube channel in read-only mode so brands can verify subscriber counts, channel views, and aggregated viewer demographics before booking sponsorships.

## Test Flow for Google Reviewers
1. **Sign In (Normal Creator Account):**
   - Navigate to `https://adzunova.tech/auth/creator/sign-in` and sign in using the dedicated reviewer test credentials provided in the Google Cloud Verification submission form *(never committed to source control)*.
2. **Navigate to Connected Accounts:**
   - Go to `/creator/accounts`.
   - Review the pre-connect read-only consent notice on the **YouTube** card.
3. **Connect YouTube Channel:**
   - Click **Connect YouTube** (`/creator/me/social-accounts/youtube/connect`).
   - Grant both read-only scopes (`youtube.readonly` and `yt-analytics.readonly`) on the Google consent screen.
   - Verify redirect to `/creator/accounts?connected=youtube` with channel title, handle, subscriber count (or "Hidden by creator"), video count, and `Data Through` date.
4. **Inspect Verified Analytics:**
   - Open `/creator/analytics` and select the **YouTube** tab to inspect daily views/watch-time and `"Viewer Age/Gender (Google estimate)"`.
5. **Test Disconnect & Revocation:**
   - Return to `/creator/accounts`, click **Disconnect**, optionally check *"Also delete stored historical YouTube metrics and snapshots"*, and confirm.
   - Confirm access is revoked at `https://myaccount.google.com/permissions`.
