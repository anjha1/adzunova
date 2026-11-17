import type { Metadata } from 'next';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { ProductShowcase } from '@/components/marketing/product-showcase';
import { EarlyAccess } from '@/components/marketing/early-access';

export const metadata: Metadata = {
  title: 'Platform Overview & Capabilities | Adzunova',
  description:
    'Explore the 12-step creator collaboration lifecycle and interactive features across discovery, campaign orchestration, and settlements.',
};

export default function ProductPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Complete Platform Tour
        </h1>
        <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          From first discovery query to final escrow settlement, see every phase of the Adzunova collaboration engine.
        </p>
      </div>

      <ProductShowcase />
      <HowItWorks />
      <EarlyAccess />
    </div>
  );
}
