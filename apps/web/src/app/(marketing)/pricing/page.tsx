import type { Metadata } from 'next';
import { V2EarlyAccess } from '@/components/marketing/v2-early-access';

export const metadata: Metadata = {
  title: 'Transparent Pricing — Zero Setup Fees | Adzunova',
  description:
    'Free to join for creators. Simple, transparent pricing for brands and agencies with milestone escrow protection.',
};

export default function PricingPage() {
  return (
    <div className="py-16 max-w-5xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase mb-2 block">
          Transparent &amp; Fair
        </span>
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Simple pricing. Zero surprises.
        </h1>
        <p className="text-base text-[var(--color-fg-secondary)]">
          Join free during early access. Pay only when deals successfully complete.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-4">
              For Content Creators
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-fg-primary)] mb-2">100% Free to Join</h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mb-6">
              Create your verified profile, connect your social channels, receive brand offers, and get paid with zero deduction from your agreed fee.
            </p>
            <ul className="space-y-3 text-sm text-[var(--color-fg-primary)]">
              <li className="flex items-center gap-2">✓ Verified audience media kit</li>
              <li className="flex items-center gap-2">✓ Automated deliverables contracts</li>
              <li className="flex items-center gap-2">✓ Protected milestone escrow payments</li>
              <li className="flex items-center gap-2">✓ Zero platform listing fees</li>
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <span className="text-2xl font-extrabold text-[var(--color-fg-primary)]">₹0 / month</span>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[var(--color-surface-1)] border-2 border-brand-500/50 flex flex-col justify-between shadow-lg relative">
          <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-brand-600 text-white font-bold text-xs uppercase tracking-wide">
            Early Access
          </div>
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
              For Brands &amp; Agencies
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-fg-primary)] mb-2">Per-Campaign Escrow</h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mb-6">
              Discover verified creators, manage milestones, review draft assets in real time, and scale campaigns with zero upfront subscription.
            </p>
            <ul className="space-y-3 text-sm text-[var(--color-fg-primary)]">
              <li className="flex items-center gap-2">✓ Direct social API creator verification</li>
              <li className="flex items-center gap-2">✓ In-thread video review &amp; timecoded comments</li>
              <li className="flex items-center gap-2">✓ Escrow deposit with milestone releases</li>
              <li className="flex items-center gap-2">✓ Detailed performance reporting</li>
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <span className="text-2xl font-extrabold text-[var(--color-fg-primary)]">Standard 5%</span>
            <span className="text-xs text-[var(--color-fg-muted)] ml-2">transaction fee on settled deals</span>
          </div>
        </div>
      </div>

      <V2EarlyAccess />
    </div>
  );
}
