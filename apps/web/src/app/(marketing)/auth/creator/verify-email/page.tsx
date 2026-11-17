'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';
import { OtpInput } from '@/components/auth/otp-input';

function CreatorVerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const canResend = countdown === 0;

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
          email: emailParam || undefined,
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
          email: emailParam || undefined,
          purpose: 'EMAIL_VERIFICATION',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code.');
      }

      setCountdown(60);
      setOtp('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard
      badgeText="Creator Account Security"
      title="Verify Your Creator Account"
      subtitle={
        emailParam
          ? `We have dispatched a 6-digit confirmation code to ${emailParam}.`
          : 'Enter the 6-digit security code sent to your email.'
      }
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Verified!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Directing you to creator workspace setup...
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
              Enter 6-Digit Code
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
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-indigo-500/20 transition-all duration-200"
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
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
            Need to change your account details?{' '}
            <Link href="/auth/creator/sign-up" className="text-indigo-500 hover:underline">
              Start over
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}

export default function CreatorVerifyEmailPage() {
  return (
    <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading security verification...</div>}>
        <CreatorVerifyEmailContent />
      </Suspense>
    </div>
  );
}
