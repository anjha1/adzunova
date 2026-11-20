'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SocialPlatformIcon } from '@/components/creator/ui/social-platform-icon';

// Dynamically import 3D scene (client-only, no SSR)
const HeroNetworkScene = dynamic(
  () =>
    import('@/components/three/hero-network-scene').then(
      (m) => m.HeroNetworkScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[280px] flex items-center justify-center rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] animate-pulse">
        <span className="text-xs text-[var(--color-fg-muted)]">Loading 3D workspace...</span>
      </div>
    ),
  }
);

const PLATFORM_CHIPS = ['YouTube', 'Instagram', 'TikTok', 'Podcasts', 'Actors', 'UGC'];

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function V2Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 desk:pt-12 desk:pb-16 border-b border-[var(--color-border)]">
      {/* Background ambient gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] desk:w-[900px] h-[400px] bg-gradient-to-b from-brand-500/15 via-indigo-500/10 to-transparent blur-3xl -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 desk:px-6">
        <div className="grid grid-cols-1 desk:grid-cols-12 gap-8 desk:gap-10 items-center">
          
          {/* Left Column: Headline, subhead, creator-first CTAs, platform chips */}
          <div className="desk:col-span-6 flex flex-col items-center desk:items-start text-center desk:text-left">
            
            {/* Status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-[var(--color-fg-secondary)]">
                Early Access Live for Creators &amp; Brands
              </span>
            </div>

            {/* Headline: <= 8 words, bold, largest element on page */}
            <h1 className="text-4xl sm:text-5xl desk:text-6xl lg:text-7xl font-black tracking-tight text-[var(--color-fg-primary)] leading-[1.08] mb-4">
              Where creators and brands close real deals.
            </h1>

            {/* Supporting line: 1 clean line */}
            <p className="text-base desk:text-lg text-[var(--color-fg-secondary)] max-w-xl mb-6 leading-relaxed">
              Verify your metrics, agree on deliverables, and get paid on time in one verified workspace.
            </p>

            {/* CTAs: Real buttons with primary gradient and outlined secondary */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-6">
              <Link
                href="/auth/creator/sign-in"
                className="group w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all cursor-pointer"
              >
                <span>I&apos;m a Creator</span>
                <ArrowRightIcon />
              </Link>

              <Link
                href="/auth/brand/sign-in"
                className="group w-full sm:w-auto inline-flex items-center justify-center h-13 px-6 rounded-xl bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] text-[var(--color-fg-primary)] font-semibold text-sm border-2 border-[var(--color-border)] hover:border-brand-500/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all cursor-pointer"
              >
                <span>I&apos;m a Brand or Agency</span>
                <ArrowRightIcon />
              </Link>
            </div>

            {/* Supported platforms strip */}
            <div className="flex flex-wrap items-center justify-center desk:justify-start gap-2">
              <span className="text-xs text-[var(--color-fg-muted)] font-medium mr-1">
                Supported:
              </span>
              {PLATFORM_CHIPS.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--color-surface-2)] text-[var(--color-fg-secondary)] border border-[var(--color-border)] shadow-2xs hover:border-brand-500/40 transition"
                >
                  <SocialPlatformIcon platform={platform} size={14} className="shrink-0" />
                  <span>{platform}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive 3D Card Orbit */}
          <div className="desk:col-span-6 w-full">
            <div className="relative w-full max-h-[380px] desk:max-h-[400px] mx-auto rounded-2xl bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-surface-1)] border border-[var(--color-border)] p-2 shadow-xl overflow-hidden flex flex-col">
              
              {/* Scene header note */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border)] z-10 shrink-0">
                <span className="text-[11px] font-semibold text-[var(--color-fg-muted)] uppercase tracking-wider">
                  Interactive Roster
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Sample preview &bull; Drag to rotate &bull; Tap cards
                </span>
              </div>

              {/* 3D Canvas + Cards Orbit wrapper */}
              <div className="relative flex-1 w-full h-full min-h-[290px] flex items-center justify-center">
                <HeroNetworkScene />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
