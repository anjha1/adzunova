import type { Metadata } from 'next';
import { TrustAndAI } from '@/components/marketing/trust-and-ai';
import { V2EarlyAccess } from '@/components/marketing/v2-early-access';

export const metadata: Metadata = {
  title: 'Resources, Guides & Ecosystem Insights | Adzunova',
  description:
    'Documentation, trust guidelines, FAQs, and resources for creators and marketing teams.',
};

export default function ResourcesPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Resources &amp; Knowledge
        </h1>
        <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          Explore how Adzunova powers trusted relationships across the global creator ecosystem.
        </p>
      </div>

      <TrustAndAI />
      <V2EarlyAccess />
    </div>
  );
}
