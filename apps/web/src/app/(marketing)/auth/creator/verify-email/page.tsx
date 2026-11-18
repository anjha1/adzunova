'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';
import { OtpInput } from '@/components/auth/otp-input';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 3)}***@${domain}`;
}

export default function CreatorVerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [sessionLoading, setSessionLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const canResend = countdown === 0;

  // Retrieve authenticated session securely
  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted) return;
        if (!data || !data.authenticated) {
          router.replace('/auth/creator/sign-in');
          return;
        }
        if (data.user?.emailVerified) {
          router.replace(data.profile?.onboardingCompleted ? '/creator/dashboard' : '/creator/onboarding');
          return;
        }
        setEmail(data.user?.email || '');
        setSessionLoading(false);
      })
      .catch(() => {
        if (mounted) setSessionLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-otp',
          code: otp,
          purpose: 'EMAIL_VERIFICATION',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/creator/onboarding');
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          purpose: 'EMAIL_VERIFICATION',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch code.');
      }

      setCountdown(60);
      setOtp('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to dispatch code.');
    } finally {
      setResending(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-500 dark:text-slate-400 text-sm">Verifying session security...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AuthCard
        badgeText="Creator Account Security"
        title="Verify Creator Email"
        subtitle={
          email
            ? `A 6-digit verification code has been dispatched to ${maskEmail(email)}.`
            : 'Enter the 6-digit verification code sent to your email.'
        }
      >
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Verified!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Directing you to creator profile setup...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 text-sm rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Security 6-Digit Code
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
                hasError={Boolean(error)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold underline underline-offset-4"
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <span>
                  Resend code in <strong className="text-slate-700 dark:text-slate-300">{countdown}s</strong>
                </span>
              )}
            </div>

            <div className="pt-2 text-center text-xs text-slate-400">
              Wrong email address?{' '}
              <Link href="/auth/creator/sign-up" className="text-indigo-500 hover:underline">
                Re-enter details
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
