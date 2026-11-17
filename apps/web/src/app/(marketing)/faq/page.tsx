import type { Metadata } from 'next';
import { EarlyAccess } from '@/components/marketing/early-access';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Adzunova',
  description:
    'Common questions about creator verification, brand onboarding, escrow payments, and early access on Adzunova.',
};

const FAQS = [
  {
    q: 'How does Adzunova verify creator audience data?',
    a: 'Adzunova connects directly to social media platform APIs with read-only creator authorization, verifying genuine view velocity, audience geography, and follower demographics to eliminate fake engagement.',
  },
  {
    q: 'How does escrow protection work for brand deals?',
    a: 'Brands fund milestones upfront into protected escrow. Creators work with peace of mind knowing funds are secured. Funds are released automatically or immediately upon brand approval of agreed deliverables.',
  },
  {
    q: 'Who can join the early access cohort?',
    a: 'We are currently accepting YouTube creators, Instagram/TikTok creators, UGC video specialists, actors, models, voiceover artists, and verified brands/agencies seeking structured collaboration.',
  },
  {
    q: 'What fees does Adzunova charge?',
    a: 'During early access, creator signups and profiles are 100% free with zero platform listing fees. Standard platform transaction terms apply only upon milestone settlement.',
  },
];

export default function FAQPage() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl desk:text-5xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[var(--color-fg-secondary)] max-w-xl mx-auto">
          Everything you need to know about our creator-brand collaboration platform.
        </p>
      </div>

      <div className="space-y-4 mb-16">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-sm"
          >
            <h3 className="text-base font-bold text-[var(--color-fg-primary)] mb-2">
              {faq.q}
            </h3>
            <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <EarlyAccess />
    </div>
  );
}
