import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { V2Hero } from '@/components/marketing/v2-hero';
import { V2QuickVideo } from '@/components/marketing/v2-quick-video';
import { V2FourSteps } from '@/components/marketing/v2-four-steps';
import { V2Showcase } from '@/components/marketing/v2-showcase';
import { V2EarlyAccess } from '@/components/marketing/v2-early-access';
import { StickyCta } from '@/components/layout/sticky-cta';

export const metadata: Metadata = {
  title: 'Adzunova — Global Creator & Brand Collaboration Platform',
  description:
    'Where creators and brands close real deals. Verified talent, transparent deliverables, and instant escrow payments in one workspace.',
  openGraph: {
    title: 'Adzunova — Global Creator & Brand Collaboration Platform',
    description:
      'Where creators and brands close real deals. Verified talent, transparent deliverables, and instant escrow payments in one workspace.',
    type: 'website',
    siteName: 'Adzunova',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adzunova — Global Creator & Brand Collaboration Platform',
    description:
      'Where creators and brands close real deals. Verified talent, transparent deliverables, and instant escrow payments in one workspace.',
  },
};

export default async function HomePage() {
  const session = await getSession();

  if (session?.user) {
    if (session.user.role === 'CREATOR') {
      redirect('/creator/dashboard');
    } else if (session.user.role === 'BRAND') {
      redirect('/brand/dashboard');
    }
  }

  return (
    <>
      {/* 1. Hero: <8 word headline, 1-line subhead, Creator-first CTA, 3D card ring */}
      <V2Hero />

      {/* 2. See it in 10 seconds: Animated loop player + 3 captions + category marquee */}
      <V2QuickVideo />

      {/* 3. How it works in 4 steps: Discover, Agree, Create, Get paid */}
      <V2FourSteps />

      {/* 4. Product showcase: 1 panel with 3 tabs */}
      <V2Showcase />

      {/* 5. Early access: Compact form + trust chips */}
      <V2EarlyAccess />

      {/* Mobile-only sticky bottom CTA */}
      <StickyCta />
    </>
  );
}
