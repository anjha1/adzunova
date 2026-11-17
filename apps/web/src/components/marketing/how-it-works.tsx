'use client';

import React, { useState } from 'react';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal } from '@/components/motion';

export function HowItWorks() {
  const { howItWorks } = LANDING_CONTENT;
  const [expandedPhase, setExpandedPhase] = useState<number>(0);

  return (
    <section
      aria-labelledby="how-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <Reveal delay={50}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 block">
              {howItWorks.badge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="how-heading"
              className="text-[clamp(2rem,4vw,3.125rem)] font-black tracking-tight text-[var(--color-fg-primary)] leading-tight mb-4"
            >
              {howItWorks.headline}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-fg-secondary)] leading-relaxed">
              {howItWorks.subheadline}
            </p>
          </Reveal>
        </div>

        {/* 3 Phases Interactive Stepper */}
        <div className="grid grid-cols-1 desk:grid-cols-3 gap-8">
          {howItWorks.phases.map((phase, idx) => {
            const isExpanded = expandedPhase === idx;
            return (
              <div
                key={phase.code}
                className={`p-6 desk:p-8 rounded-3xl bg-[var(--color-surface-1)] border transition-all flex flex-col justify-between ${
                  isExpanded ? 'border-brand-500 shadow-xl' : 'border-[var(--color-border)] opacity-80'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {phase.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedPhase(idx)}
                      className="text-xs font-semibold px-2 py-1 rounded-md bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                    >
                      {isExpanded ? 'Active Stage' : 'Select Stage'}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                      {phase.summary}
                    </p>
                  </div>

                  {/* 4 Steps within this phase */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    {phase.steps.map((s) => (
                      <div
                        key={s.num}
                        className="p-3 rounded-xl bg-[var(--color-surface-2)] flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                            {s.num}.
                          </span>
                          <span className="text-xs font-bold text-[var(--color-fg-primary)]">
                            {s.title}
                          </span>
                        </div>
                        <p className="text-[0.6875rem] text-[var(--color-fg-muted)] leading-relaxed pl-5">
                          {s.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-fg-muted)]">
                  <span>Structured Milestone</span>
                  <span>Transparent Delivery</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
