import type { Metadata } from 'next';
import { TrustAndAI } from '@/components/marketing/trust-and-ai';
import { EarlyAccess } from '@/components/marketing/early-access';

export const metadata: Metadata = {
  title: 'Trust, Safety & Advisory Intelligence | Adzunova',
  description:
    'Learn how Adzunova combines platform-verified analytics, milestone-protected escrow, and advisory AI with humans in control.',
};

export default function TrustPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Trust &amp; Verification Infrastructure
        </h1>
        <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          Every creator metric is platform-verified. Every deal is secured by milestone escrow. Every AI insight serves humans who make the final call.
        </p>
      </div>

      <TrustAndAI />
      <EarlyAccess />
    </div>
  );
}
