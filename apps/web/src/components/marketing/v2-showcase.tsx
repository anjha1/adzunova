'use client';

import React, { useState } from 'react';

const TABS = [
  { id: 'discovery', label: 'Talent discovery' },
  { id: 'milestones', label: 'Milestones & review' },
  { id: 'payments', label: 'Instant payments' },
];

export function V2Showcase() {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <section className="py-12 desk:py-16 bg-[var(--color-surface-1)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 desk:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase mb-2 block">
            Inside Adzunova
          </span>
          <h2 className="text-2xl desk:text-3xl font-extrabold text-[var(--color-fg-primary)]">
            Built for transparent creator commerce.
          </h2>
        </div>

        {/* 1 Interactive Panel with at most 3 tabs */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[var(--color-bg-base)] border border-[var(--color-border)] shadow-xl overflow-hidden">
          
          {/* Tabs navigation */}
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/50">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 text-center text-xs desk:text-sm font-semibold transition-all cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-[var(--color-bg-base)]'
                      : 'border-transparent text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Panel Content Body */}
          <div className="p-6 desk:p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[var(--color-fg-muted)]">
                VIEW: {activeTab.toUpperCase()}_PANEL
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Sample preview &bull; Live interface demo
              </span>
            </div>

            {/* Tab 1: Talent discovery */}
            {activeTab === 'discovery' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold text-xs">
                      AM
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[var(--color-fg-primary)]">Aarav M.</div>
                      <div className="text-[10px] text-[var(--color-fg-muted)]">Tech &bull; YouTube 840K</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--color-fg-secondary)]">Engagement: 4.8% &bull; ₹80K base</div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      SK
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[var(--color-fg-primary)]">Sneha K.</div>
                      <div className="text-[10px] text-[var(--color-fg-muted)]">UGC &bull; Instagram 420K</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--color-fg-secondary)]">Engagement: 5.6% &bull; ₹45K base</div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      RV
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[var(--color-fg-primary)]">Rohan V.</div>
                      <div className="text-[10px] text-[var(--color-fg-muted)]">Gaming &bull; Twitch 310K</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--color-fg-secondary)]">Engagement: 7.1% &bull; ₹60K base</div>
                </div>
              </div>
            )}

            {/* Tab 2: Milestones & review */}
            {activeTab === 'milestones' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-xs">✓</span>
                    <div>
                      <div className="text-xs font-bold text-[var(--color-fg-primary)]">Brief Alignment &amp; Script Approval</div>
                      <div className="text-[10px] text-[var(--color-fg-muted)]">Approved on Nov 12 &bull; Escrow Milestone 1 Released</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Completed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-600 flex items-center justify-center text-xs">●</span>
                    <div>
                      <div className="text-xs font-bold text-[var(--color-fg-primary)]">Rough Cut Video Review (v2 Uploaded)</div>
                      <div className="text-[10px] text-[var(--color-fg-muted)]">2 Brand annotations pending review</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-500">In Review</span>
                </div>
              </div>
            )}

            {/* Tab 3: Instant payments */}
            {activeTab === 'payments' && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[var(--color-surface-1)] to-[var(--color-surface-2)] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    Escrow Protection Active
                  </div>
                  <div className="text-base font-extrabold text-[var(--color-fg-primary)]">
                    ₹1,20,000 Payout Ready
                  </div>
                  <div className="text-xs text-[var(--color-fg-secondary)] mt-1">
                    Direct transfer to verified creator account within 60 seconds of client approval.
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0 shadow-md">
                  Auto-Settled
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
