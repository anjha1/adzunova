'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthModal } from './auth-modal-context';
import { Logo } from '@/components/brand/Logo';

export function AuthModal() {
  const { isOpen, closeAuth, role, setRole, mode, setMode } = useAuthModal();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();
  }, [isOpen]);

  if (!isOpen) return null;

  function handleGoogleAuth() {
    setStatus('loading');
    window.location.href = `/api/auth/google?role=${role === 'brand' ? 'BRAND' : 'CREATOR'}`;
  }

  function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const targetPath = role === 'brand'
      ? (mode === 'signup' ? '/auth/brand/sign-up' : '/auth/brand/sign-in')
      : (mode === 'signup' ? '/auth/creator/sign-up' : '/auth/creator/sign-in');
    window.location.href = `${targetPath}?email=${encodeURIComponent(email)}`;
  }

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-end desk:items-center justify-center p-0 desk:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuth}
        aria-hidden="true"
      />

      {/* Modal Card (Bottom-sheet on mobile, centered dialog on desktop) */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-t-3xl desk:rounded-3xl p-6 desk:p-8 shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-6 desk:slide-in-from-bottom-2 duration-200"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeAuth}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label="Close dialog"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h3 id="auth-modal-title" className="text-xl font-bold text-[var(--color-fg-primary)]">
              Welcome to Adzunova!
            </h3>
            <p className="text-sm text-[var(--color-fg-secondary)] max-w-xs">
              {role === 'creator'
                ? 'Your creator application is authenticated. Redirecting to your creator onboarding workspace...'
                : 'Your brand workspace is authenticated. Redirecting to your campaign manager...'}
            </p>
            <button
              type="button"
              onClick={closeAuth}
              className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Close and continue
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Title & Role switch */}
            <div>
              <div className="mb-2">
                <Logo variant="full" size="sm" href={false} />
              </div>
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                {mode === 'signup' ? 'Fast 1-Click Access' : 'Sign In to Workspace'}
              </span>
              <h2 id="auth-modal-title" className="text-2xl font-extrabold text-[var(--color-fg-primary)] tracking-tight">
                {mode === 'signup'
                  ? role === 'creator'
                    ? 'Join as a Creator'
                    : 'Join as a Brand or Agency'
                  : 'Welcome Back'}
              </h2>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`py-2 rounded-lg transition-all ${
                  role === 'creator'
                    ? 'bg-[var(--color-surface-1)] text-[var(--color-fg-primary)] shadow-sm'
                    : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
                }`}
              >
                Creator / Talent
              </button>
              <button
                type="button"
                onClick={() => setRole('brand')}
                className={`py-2 rounded-lg transition-all ${
                  role === 'brand'
                    ? 'bg-[var(--color-surface-1)] text-[var(--color-fg-primary)] shadow-sm'
                    : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]'
                }`}
              >
                Brand / Agency
              </button>
            </div>

            {/* Primary Google Auth (1-Click for YouTubers & Creators) */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={status === 'loading'}
              className="h-12 w-full px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] text-[var(--color-fg-primary)] font-semibold text-sm flex items-center justify-center gap-3 shadow-sm transition-all active:scale-[0.99]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-fg-muted)] font-medium uppercase">or email</span>
              <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 px-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-fg-primary)] text-sm placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                {status === 'loading'
                  ? 'Verifying...'
                  : mode === 'signup'
                  ? 'Continue with Email'
                  : 'Sign In with Email'}
              </button>
            </form>

            {/* Mode switch */}
            <div className="text-center text-xs text-[var(--color-fg-secondary)] pt-1">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Sign up free
                  </button>
                </>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[0.6875rem] text-center text-[var(--color-fg-muted)] leading-tight">
              By proceeding, you agree to Adzunova&apos;s Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
