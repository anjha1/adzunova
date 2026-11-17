'use client';

import React, { useState, useEffect } from 'react';

const CAPTIONS = [
  { step: '01', title: 'Discover', desc: 'Find verified creators matching your exact audience demographics.' },
  { step: '02', title: 'Agree', desc: 'Lock clear deliverables, timelines, and rights in one agreement.' },
  { step: '03', title: 'Get Paid', desc: 'Milestone escrow releases instantly upon approved delivery.' },
];

const CATEGORIES = [
  'Tech & AI Reviewers',
  'UGC Video Creators',
  'Gaming & Streamers',
  'Actors & Voice Talent',
  'Lifestyle & Travel',
  'Musicians & Producers',
  'B2B & SaaS Experts',
  'Fitness & Athletes',
];

export function V2QuickVideo() {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through the 3 captions automatically every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % CAPTIONS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 desk:py-16 bg-[var(--color-surface-1)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 desk:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase mb-2 block">
            See it in 10 seconds
          </span>
          <h2 className="text-2xl desk:text-3xl font-extrabold text-[var(--color-fg-primary)]">
            How deals happen on Adzunova.
          </h2>
        </div>

        {/* Video / Animated Loop + Captions Grid */}
        <div className="grid grid-cols-1 desk:grid-cols-12 gap-8 items-center max-w-5xl mx-auto mb-10">
          
          {/* Animated interactive loop player */}
          <div className="desk:col-span-7">
            <div className="relative rounded-2xl bg-[var(--color-bg-base)] border border-[var(--color-border)] p-4 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-mono text-[var(--color-fg-muted)]">deal-workflow.mp4</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Sample preview
                </span>
              </div>

              {/* Dynamic visual frame reflecting current active step */}
              <div className="h-56 desk:h-64 rounded-xl bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface-3)] flex flex-col items-center justify-center p-6 text-center transition-all duration-500">
                {activeStep === 0 && (
                  <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold text-xl mb-3">
                      🔍
                    </div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] mb-1">
                      Targeted Match: @marcus_tech
                    </div>
                    <div className="text-xs text-[var(--color-fg-secondary)] max-w-xs">
                      YouTube 1.2M &bull; 94% Audience Fit &bull; ₹1.2L Est.
                    </div>
                  </div>
                )}
                {activeStep === 1 && (
                  <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-xl mb-3">
                      ✍️
                    </div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] mb-1">
                      Digital Agreement Locked
                    </div>
                    <div className="text-xs text-[var(--color-fg-secondary)] max-w-xs">
                      1 Dedicated Video + 2 Shorts &bull; Delivery Nov 28 &bull; Escrow Funded
                    </div>
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xl mb-3">
                      💳
                    </div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] mb-1">
                      Payout Transferred &bull; ₹1,20,000
                    </div>
                    <div className="text-xs text-[var(--color-fg-secondary)] max-w-xs">
                      Assets Approved &bull; Instant Settlement to Creator Bank
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar timer */}
              <div className="mt-3 flex gap-1.5">
                {CAPTIONS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      idx === activeStep ? 'bg-brand-600' : 'bg-[var(--color-border)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3 Step Captions */}
          <div className="desk:col-span-5 flex flex-col gap-3">
            {CAPTIONS.map((cap, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  type="button"
                  key={cap.step}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface-2)] border-brand-500/40 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-[var(--color-surface-2)]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? 'text-brand-600 dark:text-brand-400' : 'text-[var(--color-fg-muted)]'
                      }`}
                    >
                      {cap.step}
                    </span>
                    <h3 className="text-base font-bold text-[var(--color-fg-primary)]">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {cap.desc}
                  </p>
                </button>
              );
            })}
          </div>

        </div>

        {/* Category marquee strip */}
        <div className="pt-4 border-t border-[var(--color-border)]/60 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center gap-2 min-w-max">
            <span className="text-xs text-[var(--color-fg-muted)] font-medium">Categories:</span>
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-2)] text-[var(--color-fg-secondary)] border border-[var(--color-border)]"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
