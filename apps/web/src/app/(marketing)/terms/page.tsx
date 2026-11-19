import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Adzunova',
  description: 'Adzunova Marketplace Terms of Service: Platform rules for creators and brands.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'November 19, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 desk:px-8 py-12 desk:py-16 text-foreground">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <span>Adzunova Legal Agreement</span>
        </div>
        <h1 className="text-3xl desk:text-5xl font-black tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last Updated: {lastUpdated} • Effective Date: January 1, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm desk:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground">
            By creating an account, accessing, or using Adzunova, you agree to be bound by these Terms of Service and our{' '}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Privacy Policy
            </Link>. If you do not agree to these terms, do not access or use the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            2. Creator Responsibilities & Platform Authenticity
          </h2>
          <p className="text-muted-foreground">
            Creators must represent their digital profiles, follower reach, and engagement truthfully:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              You must only connect social media accounts (Instagram, YouTube, TikTok) that you legally own and administer.
            </li>
            <li>
              Artificial inflation of follower counts, bot engagement, or deceptive media representations will result in immediate suspension.
            </li>
            <li>
              All campaign deliverables must comply with applicable advertising disclosure laws (such as FTC guidelines and ASCI guidelines in India).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            3. Brand Sponsorship Contracts & Deliverables
          </h2>
          <p className="text-muted-foreground">
            Brand sponsorships booked through Adzunova constitute binding agreements between the respective brand and creator. Deliverables, review milestones, and deadlines are tracked directly within the campaign workspace.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            4. Third-Party Platform Terms
          </h2>
          <p className="text-muted-foreground">
            When connecting your social accounts, you also agree to comply with third-party platform terms, including Meta Platform Terms, Instagram Community Guidelines, and YouTube Terms of Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            5. Termination & Account Closure
          </h2>
          <p className="text-muted-foreground">
            Either party may terminate account access at any time. Upon account termination, connected platform credentials are deleted immediately, and public marketplace listings are unindexed.
          </p>
        </section>
      </div>
    </div>
  );
}
