'use client';

import React from 'react';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal } from '@/components/motion';

export function TrustAndAI() {
  const { trustAndAI } = LANDING_CONTENT;

  return (
    <section
      aria-labelledby="trust-ai-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Top Half: Trust & Verification Ladder */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <Reveal delay={50}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 block">
              {trustAndAI.trustBadge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="trust-ai-heading"
              className="text-[clamp(2rem,4vw,3.125rem)] font-black tracking-tight text-[var(--color-fg-primary)] leading-tight mb-4"
            >
              {trustAndAI.trustHeadline}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-fg-secondary)] leading-relaxed">
              {trustAndAI.trustSubheadline}
            </p>
          </Reveal>
        </div>

        {/* 2-Column Split: Verification Ladder vs Safeguards */}
        <div className="grid grid-cols-1 desk:grid-cols-12 gap-8 items-start mb-24">
          {/* Left Column: Verification Ladder (5 cols) */}
          <div className="desk:col-span-5 p-6 desk:p-8 rounded-3xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <span className="text-sm font-bold text-[var(--color-fg-primary)]">
                Profile Verification Ladder
              </span>
              <span className="text-xs text-[var(--color-fg-muted)]">Trust Progression</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {trustAndAI.tiers.map((tier, idx) => (
                <div
                  key={tier.name}
                  className="p-3 rounded-xl bg-[var(--color-surface-2)] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--color-surface-1)] border border-[var(--color-border)] text-[0.625rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-fg-primary)] truncate">
                        {tier.name}
                      </span>
                      <span className="text-[0.625rem] font-bold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0 ml-2">
                        {tier.state}
                      </span>
                    </div>
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)]">
                      {tier.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Core Safeguards (7 cols) */}
          <div className="desk:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustAndAI.safeguards.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between gap-3"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-base font-bold text-[var(--color-fg-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[0.6875rem] text-[var(--color-fg-muted)] pt-2 border-t border-[var(--color-border)]">
                  Standardized Collaboration Safeguard
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Half: Intelligent Partnership Tools & Human Governance Notice */}
        <div className="p-8 desk:p-14 rounded-3xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-2">
              {trustAndAI.aiBadge}
            </span>
            <h3 className="text-2xl desk:text-3xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-3">
              {trustAndAI.aiHeadline}
            </h3>
            <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
              {trustAndAI.aiSubheadline}
            </p>
          </div>

          {/* Guidance Notice */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-fg-secondary)] mb-8 flex items-center gap-3">
            <span className="text-base">💡</span>
            <span>{trustAndAI.aiNotice}</span>
          </div>

          {/* 6 AI Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-3 gap-4">
            {trustAndAI.aiTools.map((tool) => (
              <div
                key={tool.title}
                className="p-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {tool.badge}
                    </span>
                    <span className="text-[0.625rem] text-[var(--color-fg-muted)]">Upcoming</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-primary)]">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="text-[0.6875rem] text-[var(--color-fg-muted)] pt-2 border-t border-[var(--color-border)]">
                  Advisory insights &bull; User approved
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
