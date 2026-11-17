'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard, GoogleAuthButton } from '@/components/auth/auth-card';

function CreatorSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(queryError || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryError) {
      setError(queryError);
    }
  }, [queryError]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user?.role === 'CREATOR') {
          router.replace(data.profile?.onboardingCompleted ? '/creator/dashboard' : '/creator/onboarding');
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
          role: 'CREATOR',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      router.push(data.profile?.onboardingCompleted ? '/creator/dashboard' : '/creator/onboarding');
      router.refresh();
    } catch {
      setError('Connection failed. Please check your network.');
      setLoading(false);
    }
  }

  const isBrandAccountMismatch = error.toLowerCase().includes('brand');

  return (
    <AuthCard
      badgeText="Creator Portal"
      title="Welcome Back"
      subtitle="Sign in to manage your campaigns, brand deals and escrow payouts."
    >
      <div className="space-y-5">
        <GoogleAuthButton role="CREATOR" />

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[var(--color-border)] w-full" />
          <span className="bg-[var(--color-surface-1)] px-3 text-xs uppercase tracking-wider text-[var(--color-fg-muted)] font-mono">
            Or with email
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold leading-relaxed space-y-2">
            <div>{error}</div>
            {isBrandAccountMismatch && (
              <div className="pt-2 border-t border-amber-500/20">
                <Link
                  href="/auth/brand/sign-in"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Switch to Brand Sign In &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/auth/creator/forgot-password"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In as Creator'}
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-fg-secondary)]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/creator/sign-up" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Register as a Creator
          </Link>
        </div>

        <div className="text-center text-xs text-[var(--color-fg-muted)]">
          Representing a brand or company?{' '}
          <Link href="/auth/brand/sign-in" className="font-semibold hover:underline">
            Brand Sign In &rarr;
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

export default function CreatorSignInPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm p-8 text-center">Loading sign in...</div>}>
      <CreatorSignInForm />
    </Suspense>
  );
}
