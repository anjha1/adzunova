# Google Verification Demo Video Script (English, Unlisted YouTube Video)

> **Recording Rules:** Ensure the browser address bar is visible at all times, show the exact **OAuth Client ID** in the URL bar on the Google Consent Screen, and show the **English** consent screen.

1. **Introduction & Homepage (0:00–0:20)**
   - Open `https://adzunova.tech` (public homepage).
   - Briefly show the homepage description explaining Adzunova (creator–brand advertising marketplace) and scroll to the footer showing the **Privacy Policy** (`/privacy`) and **Terms of Service** (`/terms`) links.
2. **Creator Sign-In & Pre-Connect Notice (0:20–0:45)**
   - Sign in as a Creator and navigate to `/creator/accounts`.
   - Point out the YouTube card and the pre-connect read-only notice explaining both scopes (`youtube.readonly`, `yt-analytics.readonly`), no-write guarantee, and revocation link.
3. **Google OAuth Consent Flow (0:45–1:25)**
   - Click **Connect YouTube**.
   - On the Google Sign-In & OAuth Consent Screen, highlight:
     - The `client_id=` in the URL bar matching the project's **Adzunova YouTube Connect** client.
     - Both requested scopes (`youtube.readonly` and `yt-analytics.readonly`) shown clearly.
   - Select the channel / Brand Account and click **Allow / Continue**.
4. **Connected Channel Verification (`/creator/accounts`) (1:25–1:55)**
   - Show the redirect back to `/creator/accounts?connected=youtube`.
   - Show the connected YouTube card displaying real channel title, handle, subscriber count (or "Hidden by creator"), video count, channel views, `Last Synced`, `Data Through`, and capability statuses.
5. **Verified Analytics (`/creator/analytics`) & Brand Discovery (`/brand/discover`) (1:55–2:35)**
   - Open `/creator/analytics`, switch to the **YouTube** tab, and show the `"Data through <date>"` badge and `"Viewer Age/Gender (Google estimate)"` labels.
   - Open `/c/<slug>` (public creator profile) and `/brand/discover` (brand view) to demonstrate how brands inspect verified creator metrics for sponsorships.
6. **Disconnect & Revocation (2:35–2:55)**
   - Return to `/creator/accounts`, click **Disconnect**, optionally toggle metric deletion, and confirm disconnection revokes the token and removes credentials immediately.
