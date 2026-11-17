'use client';

import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    tag: 'Verified Data',
    desc: 'Filter creators by real reach, audience geography, and verified engagement rates.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Agree',
    tag: 'Protected Scope',
    desc: 'Auto-generate standardized briefs, deliverables, revision terms, and usage rights.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Create',
    tag: 'One Workspace',
    desc: 'Share draft cuts, annotate revisions, and approve deliverables in one thread.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Get Paid',
    tag: 'Milestone Escrow',
    desc: 'Funds held securely upfront and paid out directly upon sign-off with zero delays.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

export function V2FourSteps() {
  return (
    <section className="py-12 desk:py-16 bg-[var(--color-bg-base)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 desk:px-6">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase mb-2 block">
            The Collaboration Engine
          </span>
          <h2 className="text-2xl desk:text-3xl font-extrabold text-[var(--color-fg-primary)]">
            How it works in 4 steps.
          </h2>
        </div>

        {/* 4 Steps: single row on desktop, snap-scroll horizontal on mobile */}
        <div className="flex desk:grid desk:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 desk:pb-0 no-scrollbar">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="snap-center shrink-0 w-[260px] desk:w-auto p-5 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] hover:border-brand-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-fg-muted)]">
                    {step.num}
                  </span>
                </div>

                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-fg-secondary)] border border-[var(--color-border)] mb-2">
                  {step.tag}
                </div>

                <h3 className="text-lg font-bold text-[var(--color-fg-primary)] mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex items-center gap-1.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">
                <span>Verified flow</span>
                <span>&rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
