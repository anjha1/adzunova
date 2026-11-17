'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/auth-card';

export default function BrandForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot-password',
          email,
        }),
      });

      if (!res.ok) {
        setError('Failed to process request.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Connection failure. Try again.');
      setLoading(false);
    }
  }

  return (
    <AuthCard
      badgeText="Brand Portal"
      title="Reset Password"
      subtitle="Enter your company work email to receive secure password recovery instructions."
    >
      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl mx-auto">
            ✓
          </div>
          <h3 className="text-base font-bold text-[var(--color-fg-primary)]">
            Check Your Inbox
          </h3>
          <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
            If an account exists for <span className="font-semibold text-[var(--color-fg-primary)]">{email}</span>, password reset instructions have been dispatched.
          </p>
          <div className="pt-4 border-t border-[var(--color-border)]">
            <Link href="/auth/brand/sign-in" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider mb-1.5">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Sending link...' : 'Send Recovery Instructions'}
          </button>

          <div className="pt-3 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-fg-secondary)]">
            Remember your credentials?{' '}
            <Link href="/auth/brand/sign-in" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
