import type { Metadata } from 'next';
import { ChaosToOrder } from '@/components/marketing/chaos-to-order';
import { CampaignPreviewSection } from '@/components/marketing/campaign-preview-section';
import { EarlyAccess } from '@/components/marketing/early-access';

export const metadata: Metadata = {
  title: 'For Brands & Agencies — Influencer Marketing Infrastructure | Adzunova',
  description:
    'Find vetted talent, automate contracts, review deliverables in real time, and scale influencer ROI with Adzunova.',
};

export default function ForBrandsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Eliminate chaos in creator marketing.
        </h1>
        <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          Replace messy spreadsheets and DMs with verified talent search, smart contracts, and real-time deliverables review.
        </p>
      </div>

      <ChaosToOrder />
      <CampaignPreviewSection />
      <EarlyAccess />
    </div>
  );
}
