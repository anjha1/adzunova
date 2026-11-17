'use client';

import React, { useState } from 'react';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal, TiltCard } from '@/components/motion';

export function TalentBento() {
  const { talent } = LANDING_CONTENT;
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredCategories =
    selectedFilter === 'all'
      ? talent.categories
      : talent.categories.filter((c) => c.id === selectedFilter);

  return (
    <section
      aria-labelledby="talent-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-bg-base)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <Reveal delay={50}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 block">
              {talent.badge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="talent-heading"
              className="text-[clamp(2rem,4vw,3.125rem)] font-black tracking-tight text-[var(--color-fg-primary)] leading-tight mb-4"
            >
              {talent.headline}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-fg-secondary)] leading-relaxed">
              {talent.subheadline}
            </p>
          </Reveal>
        </div>

        {/* Interactive Filter Chips */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
            }`}
          >
            All Creative Talent
          </button>
          {talent.categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setSelectedFilter(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === c.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 desk:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <TiltCard
              key={cat.id}
              className="p-8 rounded-3xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-md flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Category Scope
                  </span>
                  <span className="text-xs font-mono text-[var(--color-fg-muted)]">Verified Directory</span>
                </div>

                <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight">
                  {cat.title}
                </h3>

                <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  {cat.summary}
                </p>

                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
                  {cat.items.map((item) => (
                    <div
                      key={item}
                      className="p-2.5 rounded-xl bg-[var(--color-surface-2)] text-xs font-semibold text-[var(--color-fg-primary)] flex items-center justify-between"
                    >
                      <span>{item}</span>
                      <span className="text-emerald-500">✓</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-fg-muted)]">
                <span>Multi-Platform Reach</span>
                <span>Transparent Rate Cards</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
