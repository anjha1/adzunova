'use client';

import React, { useState } from 'react';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal } from '@/components/motion';

export function ChaosToOrder() {
  const { chaosToOrder } = LANDING_CONTENT;
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      aria-labelledby="chaos-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-bg-base)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 desk:mb-20">
          <Reveal delay={50}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 block">
              {chaosToOrder.badge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="chaos-heading"
              className="text-[clamp(2rem,4vw,3.125rem)] font-black tracking-tight text-[var(--color-fg-primary)] leading-tight mb-4"
            >
              {chaosToOrder.headline}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-fg-secondary)] leading-relaxed">
              {chaosToOrder.subheadline}
            </p>
          </Reveal>
        </div>

        {/* Interactive Stepper Grid */}
        <div className="grid grid-cols-1 desk:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Stepper Selector */}
          <div className="desk:col-span-5 flex flex-col gap-2.5">
            {chaosToOrder.painPoints.map((item, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveStep(index)}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isActive
                      ? 'bg-[var(--color-surface-1)] border-brand-500 shadow-md'
                      : 'bg-[var(--color-surface-2)] border-transparent hover:border-[var(--color-border)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-bold text-[var(--color-fg-primary)]">
                      {item.label}
                    </span>
                    <span className="text-xs text-[var(--color-fg-muted)] line-clamp-1">
                      {item.problem}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Comparative Transformation Stage */}
          <div className="desk:col-span-7">
            <div className="p-6 desk:p-8 rounded-3xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-xl flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step {activeStep + 1} of {chaosToOrder.painPoints.length}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  The Adzunova Shift
                </span>
              </div>

              {/* The Fragmented Reality */}
              <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  <span>❌</span>
                  <span>Scattered Industry Reality</span>
                </div>
                <p className="text-sm text-[var(--color-fg-primary)] leading-relaxed">
                  {chaosToOrder.painPoints[activeStep].problem}
                </p>
              </div>

              {/* The Unified Workspace Resolution */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span>✅</span>
                  <span>Adzunova Unified Solution</span>
                </div>
                <p className="text-sm font-medium text-[var(--color-fg-primary)] leading-relaxed">
                  {chaosToOrder.painPoints[activeStep].solution}
                </p>
              </div>

              {/* Stepper Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : chaosToOrder.painPoints.length - 1))}
                  className="text-xs font-bold text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)] py-2 px-3 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex gap-1.5">
                  {chaosToOrder.painPoints.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        activeStep === i ? 'w-6 bg-brand-600' : 'w-1.5 bg-[var(--color-border)]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev < chaosToOrder.painPoints.length - 1 ? prev + 1 : 0))}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 py-2 px-3 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
