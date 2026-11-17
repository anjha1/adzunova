'use client';

import React, { useState } from 'react';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal } from '@/components/motion';

export function ProductShowcase() {
  const { showcase } = LANDING_CONTENT;
  const [activeTab, setActiveTab] = useState(showcase.tabs[0].id);

  const currentTab = showcase.tabs.find((t) => t.id === activeTab) || showcase.tabs[0];

  return (
    <section
      aria-labelledby="showcase-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-bg-base)] border-b border-[var(--color-border)]"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <Reveal delay={50}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 block">
              {showcase.badge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="showcase-heading"
              className="text-[clamp(2rem,4vw,3.125rem)] font-black tracking-tight text-[var(--color-fg-primary)] leading-tight mb-4"
            >
              {showcase.headline}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] text-[var(--color-fg-secondary)] leading-relaxed">
              {showcase.subheadline}
            </p>
          </Reveal>
        </div>

        {/* Tab Pills Bar */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {showcase.tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Live Mini-UI Stage */}
        <div className="max-w-4xl mx-auto p-6 desk:p-10 rounded-3xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                {currentTab.label} Interface
              </span>
              <h3 className="text-xl font-bold text-[var(--color-fg-primary)]">
                {currentTab.title}
              </h3>
            </div>
            <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {currentTab.badge}
            </span>
          </div>

          <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed mb-6">
            {currentTab.description}
          </p>

          {/* Dynamic Mockup Viewport based on selected Tab */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            {activeTab === 'discovery' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 desk:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Channel Verified</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">YouTube 1.2M Subs</span>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Engagement Floor</span>
                    <span className="font-bold text-[var(--color-fg-primary)]">5.4% Authentic</span>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Audience Geo</span>
                    <span className="font-bold text-[var(--color-fg-primary)]">68% US &amp; Canada</span>
                  </div>
                  <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Pricing Band</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">$2.5k - $4.0k / video</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="font-semibold text-[var(--color-fg-primary)]">Video Script Draft Review</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">Approved</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="font-semibold text-[var(--color-fg-primary)]">First Cut Video Staging</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 font-bold">In Review</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="font-semibold text-[var(--color-fg-primary)]">Final Deliverable Sign-Off</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold">Upcoming</span>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-4 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)] flex items-center justify-between">
                  <div>
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block">Protected Project Funding</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">$14,200.00 Committed</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                    Release Gated on Approval
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'agreements' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="text-emerald-500 font-bold block mb-1">✓ Content Rights</span>
                  <span className="text-[var(--color-fg-secondary)]">Digital advertising usage license for 90 days.</span>
                </div>
                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="text-emerald-500 font-bold block mb-1">✓ Exclusivity</span>
                  <span className="text-[var(--color-fg-secondary)]">Category exclusivity throughout active campaign.</span>
                </div>
                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="text-emerald-500 font-bold block mb-1">✓ Revision Rounds</span>
                  <span className="text-[var(--color-fg-secondary)]">Two structured review cycles included.</span>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Audience Reach</span>
                  <span className="text-lg font-bold text-brand-600 dark:text-brand-400">420,000+ Views</span>
                </div>
                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Promo Redemptions</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1,840 Code Uses</span>
                </div>
                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Engagement Rate</span>
                  <span className="text-lg font-bold text-[var(--color-fg-primary)]">6.2% Rate</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
