'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal } from '@/components/motion';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function AudienceTabs() {
  const { audiences } = LANDING_CONTENT;
  const [activeTab, setActiveTab] = useState<'creators' | 'brands'>('creators');

  const current = audiences.tabs.find((t) => t.id === activeTab) || audiences.tabs[0];

  return (
    <section
      aria-labelledby="audiences-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <Reveal delay={50}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 block">
              {audiences.badge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="audiences-heading"
              className="text-[clamp(2rem,4vw,3.125rem)] font-black tracking-tight text-[var(--color-fg-primary)] leading-tight mb-4"
            >
              {audiences.headline}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-fg-secondary)] leading-relaxed">
              {audiences.subheadline}
            </p>
          </Reveal>
        </div>

        {/* Segmented Switcher Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] max-w-md w-full">
            <button
              type="button"
              onClick={() => setActiveTab('creators')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'creators'
                  ? 'bg-[var(--color-surface-1)] text-[var(--color-fg-primary)] shadow-md'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
              }`}
            >
              For Creators &amp; Talent
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('brands')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'brands'
                  ? 'bg-[var(--color-surface-1)] text-[var(--color-fg-primary)] shadow-md'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
              }`}
            >
              For Brands &amp; Agencies
            </button>
          </div>
        </div>

        {/* Display Panel */}
        <div className="max-w-4xl mx-auto p-8 desk:p-12 rounded-3xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-xl flex flex-col desk:flex-row items-center gap-10">
          <div className="flex-1 flex flex-col gap-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2 block">
                {current.label}
              </span>
              <h3 className="text-2xl desk:text-3xl font-extrabold text-[var(--color-fg-primary)] tracking-tight leading-snug">
                {current.headline}
              </h3>
            </div>

            <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
              {current.description}
            </p>

            <ul className="flex flex-col gap-3">
              {current.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-[var(--color-fg-primary)]">
                  <span className="text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                    <CheckIcon />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href={current.ctaHref}
                className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 transition-opacity"
              >
                {current.ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
