import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Adzunova',
  description: 'Adzunova Privacy Policy: How we collect, use, and protect creator and brand platform data.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 19, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 desk:px-8 py-12 desk:py-16 text-foreground">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <span>Adzunova Compliance & Trust</span>
        </div>
        <h1 className="text-3xl desk:text-5xl font-black tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last Updated: {lastUpdated} • Effective Date: January 1, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm desk:text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            1. Overview & Commitment
          </h2>
          <p className="text-muted-foreground">
            Adzunova (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a creator–brand advertising marketplace connecting independent digital creators with commercial brand advertisers. We are committed to safeguarding personal data in full compliance with the Digital Personal Data Protection Act (DPDP Act, India), the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and platform partner policies including Meta Platform Terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            2. Social Platform Data (Instagram & Meta Graph API)
          </h2>
          <p className="text-muted-foreground">
            When a creator connects an Instagram Professional Account via Meta Unified Login OAuth 2.0, Adzunova reads profile counts, insights and audience demographics only; it does not read or send messages. We request only the minimal permissions required to verify sponsorship reach:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Public Profile Data:</strong> Instagram account ID, username, profile photo, follower count, and published media count.
            </li>
            <li>
              <strong className="text-foreground">Audience Reach Insights:</strong> Aggregate 24-hour views (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">views total_value</code>) to confirm active impressions.
            </li>
            <li>
              <strong className="text-foreground">Aggregate Demographics:</strong> Macro-level age brackets (13–17, 18–24, 25–34, 35–44, 45–54, 55–64, 65+), gender distribution (including unknown gender segments), and top countries.
            </li>
          </ul>
          <div className="p-4 rounded-xl bg-card border border-border mt-3 text-xs desk:text-sm space-y-2">
            <div>
              <strong className="text-foreground">Strict Messaging Boundary:</strong> While Meta Unified Login configuration bundles the <code className="text-xs bg-muted px-1 py-0.5 rounded">instagram_manage_messages</code> permission, Adzunova strictly and explicitly does not access, read, send, or store private direct messages (DMs), conversation threads, message reactions, or inbox contents. Our platform does not subscribe to any messaging webhooks or invoke any Graph API messaging endpoints.
            </div>
            <div>
              <strong className="text-foreground">What We NEVER Access or Store:</strong> We do not request, read, or store private direct messages (DMs), user passwords, unpublished drafts, individual follower identities, or contacts.
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            3. Purpose of Processing & No-Sale Guarantee
          </h2>
          <p className="text-muted-foreground">
            We use social platform data solely to verify creator audience statistics for transparent rate cards, sponsorship proposals, and campaign delivery tracking.
          </p>
          <p className="font-semibold text-foreground">
            We never sell, rent, license, or exchange creator or platform data with data brokers, ad-tech networks, or unauthorized third parties under any circumstances.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            4. Security & Encryption Standards
          </h2>
          <p className="text-muted-foreground">
            OAuth tokens are stored in isolated databases using industry-standard envelope encryption (AES-256-GCM) with 96-bit initialization vectors and periodic key rotation. All server logs and monitoring telemetry automatically scrub tokens and authentication secrets.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            5. Data Retention & Deletion Rights
          </h2>
          <p className="text-muted-foreground">
            Creators retain complete control over their connected accounts and associated metrics:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Instant Disconnection:</strong> Disconnecting an account via the Creator Accounts dashboard revokes access and immediately deletes stored credentials.
            </li>
            <li>
              <strong className="text-foreground">Meta Data Deletion Callback:</strong> When you remove Adzunova from your Facebook Apps &amp; Websites settings, Meta triggers our automated deletion callback.
            </li>
            <li>
              <strong className="text-foreground">Tracking Status:</strong> Users who trigger deletion can track completion using their confirmation code on our{' '}
              <Link href="/data-deletion-status" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Data Deletion Status Page
              </Link>.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            6. Contact & Grievance Redressal
          </h2>
          <p className="text-muted-foreground">
            For privacy inquiries, GDPR/CCPA data export requests, or grievance redressal under DPDP Act 2023, please contact our Data Protection Officer at:
          </p>
          <p className="text-xs desk:text-sm font-mono bg-card p-3 rounded-lg border border-border text-foreground">
            privacy@adzunova.com • Data Protection Officer, Adzunova Marketplace
          </p>
        </section>
      </div>
    </div>
  );
}
