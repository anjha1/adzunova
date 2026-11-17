import type { Metadata } from 'next';
import { AudienceTabs } from '@/components/marketing/audience-tabs';
import { TalentBento } from '@/components/marketing/talent-bento';
import { EarlyAccess } from '@/components/marketing/early-access';

export const metadata: Metadata = {
  title: 'For Creators — Monetize & Partner with Brands | Adzunova',
  description:
    'Join Adzunova to showcase your verified audience, lock contracts with clear deliverables, and get paid with milestone-protected escrow.',
};

export default function ForCreatorsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Built for modern content creators.
        </h1>
        <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          From YouTubers and Instagrammers to voice artists, actors, and UGC creators — manage every partnership with guaranteed payments.
        </p>
      </div>

      <AudienceTabs />
      <TalentBento />
      <EarlyAccess />
    </div>
  );
}
