import type { Metadata } from 'next';
import { AudienceTabs } from '@/components/marketing/audience-tabs';
import { ChaosToOrder } from '@/components/marketing/chaos-to-order';
import { V2EarlyAccess } from '@/components/marketing/v2-early-access';

export const metadata: Metadata = {
  title: 'Solutions for Creators, Brands & Agencies | Adzunova',
  description:
    'Tailored solutions for content creators, D2C brands, and marketing agencies to build predictable, high-performing collaborations.',
};

export default function SolutionsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Solutions for every partner.
        </h1>
        <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          Whether you&apos;re a creator monetizing an audience or an enterprise managing hundreds of influencer deliverables.
        </p>
      </div>

      <AudienceTabs />
      <ChaosToOrder />
      <V2EarlyAccess />
    </div>
  );
}
