'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal } from '@/components/motion';

const HeroNetworkScene = dynamic(
  () => import('@/components/three/hero-network-scene').then((mod) => mod.HeroNetworkScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center rounded-full bg-brand-500/5 animate-pulse border border-brand-500/10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 opacity-60 blur-sm" />
      </div>
    ),
  }
);

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function Hero() {
  const [activeRole, setActiveRole] = useState<'creator' | 'brand'>('creator');
  const { hero } = LANDING_CONTENT;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[var(--color-border)]"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.2) 0%, var(--color-bg-base) 100%)',
      }}
    >
      <div className="max-w-[80rem] mx-auto px-6 pt-16 pb-14 desk:pt-28 desk:pb-20 relative">
        <div className="grid grid-cols-1 desk:grid-cols-12 gap-10 desk:gap-8 items-center">
          {/* Left Column: Heading, Role Switcher & CTAs */}
          <div className="desk:col-span-7 flex flex-col gap-6 text-left">
            {/* Eyebrow */}
            <Reveal delay={50}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] dark:bg-brand-950/60 dark:border-brand-800/60 dark:text-brand-300">
                <ShieldCheckIcon />
                <span>{hero.badge}</span>
              </div>
            </Reveal>

            {/* Core Headline */}
            <Reveal delay={100}>
              <h1
                id="hero-heading"
                className="text-[clamp(2.5rem,5.2vw,4.25rem)] font-black tracking-tight leading-[1.05] text-[var(--color-fg-primary)]"
              >
                {hero.headline}{' '}
                <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  {hero.headlineAccent}
                </span>
              </h1>
            </Reveal>

            {/* Subheadline */}
            <Reveal delay={150}>
              <p className="text-[clamp(1.0625rem,1.8vw,1.25rem)] text-[var(--color-fg-secondary)] leading-relaxed max-w-xl">
                {hero.subheadline}
              </p>
            </Reveal>

            {/* Interactive Audience Role Switcher */}
            <Reveal delay={200}>
              <div className="flex flex-col gap-3 p-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl max-w-md">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveRole('creator')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      activeRole === 'creator'
                        ? 'bg-[var(--color-bg-base)] text-[var(--color-fg-primary)] shadow-sm'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
                    }`}
                  >
                    {hero.roleSelector.creatorLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRole('brand')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      activeRole === 'brand'
                        ? 'bg-[var(--color-bg-base)] text-[var(--color-fg-primary)] shadow-sm'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
                    }`}
                  >
                    {hero.roleSelector.brandLabel}
                  </button>
                </div>
                <div className="px-3 pb-1 text-xs text-[var(--color-fg-secondary)]">
                  {activeRole === 'creator'
                    ? hero.roleSelector.creatorSubtext
                    : hero.roleSelector.brandSubtext}
                </div>
              </div>
            </Reveal>

            {/* Dynamic CTAs based on Active Role */}
            <Reveal delay={250}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <Link
                  href={activeRole === 'creator' ? '/signup?role=creator' : '/signup?role=brand'}
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md hover:opacity-95 active:scale-[0.99] transition-transform"
                >
                  <span>
                    {activeRole === 'creator'
                      ? hero.roleSelector.creatorCta
                      : hero.roleSelector.brandCta}
                  </span>
                  <ArrowRightIcon />
                </Link>

                <Link
                  href="/solutions/brands"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl text-sm font-semibold text-[var(--color-fg-primary)] bg-[var(--color-surface-1)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] transition-all"
                >
                  Explore Brand Solutions
                </Link>
              </div>
            </Reveal>

            {/* Platform Reach Chips */}
            <Reveal delay={300}>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-[var(--color-fg-muted)] font-medium mr-1">Supported Channels:</span>
                {hero.platformChips.map((chip) => (
                  <span
                    key={chip.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-fg-secondary)]"
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.name}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Column: 3D Network Scene */}
          <div className="desk:col-span-5 flex justify-center w-full">
            <Reveal delay={200} direction="none">
              <HeroNetworkScene />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
