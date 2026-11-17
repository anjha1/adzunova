'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function V2EarlyAccess() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section id="join" className="py-12 desk:py-16 bg-[var(--color-bg-base)]">
      <div className="max-w-4xl mx-auto px-4 desk:px-6 text-center">
        
        {/* Title */}
        <h2 className="text-2xl desk:text-4xl font-extrabold text-[var(--color-fg-primary)] tracking-tight mb-3">
          Join the future of creator commerce.
        </h2>
        
        <p className="text-sm desk:text-base text-[var(--color-fg-secondary)] max-w-lg mx-auto mb-8">
          Early access is rolling out. Connect your channels, lock your rates, and be first to receive inbound brand briefs.
        </p>

        {/* Form or Success message */}
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm max-w-md mx-auto mb-8 animate-in fade-in">
            ✓ You&apos;re on the priority list. We&apos;ll notify you when your creator invite activates.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto mb-6"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full h-11 px-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-[var(--color-fg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shrink-0 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              Get Invite
            </button>
          </form>
        )}

        {/* Quick alternative links */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Link
            href="/auth/creator/sign-in"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Creator Sign In &rarr;
          </Link>
          <span className="text-xs text-[var(--color-fg-muted)]">•</span>
          <Link
            href="/auth/brand/sign-in"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Brand Sign In &rarr;
          </Link>
        </div>

        {/* 3 Trust chips */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[var(--color-border)]/60 text-xs text-[var(--color-fg-muted)] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">🔒</span>
            <span>Escrow-Protected Payouts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-brand-500">✓</span>
            <span>Verified Creator Profiles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-500">🛡️</span>
            <span>Zero-Fee Early Cohort</span>
          </div>
        </div>

      </div>
    </section>
  );
}
