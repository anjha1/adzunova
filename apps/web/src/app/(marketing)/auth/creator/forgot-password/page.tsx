'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';

function getPasswordStrength(pass: string) {
  if (!pass) {
    return {
      score: 0,
      label: '',
      barColor: 'bg-slate-200 dark:bg-slate-700',
      textColor: 'text-slate-400',
      percent: 0,
      checks: { length: false, case: false, number: false, special: false },
    };
  }

  const hasLength = pass.length >= 8;
  const hasCase = /[a-z]/.test(pass) && /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[^A-Za-z0-9]/.test(pass);

  let score = 0;
  if (hasLength) score++;
  if (hasCase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  if (score <= 1) {
    return {
      score: 1,
      label: 'Weak',
      barColor: 'bg-red-500',
      textColor: 'text-red-500',
      percent: 25,
      checks: { length: hasLength, case: hasCase, number: hasNumber, special: hasSpecial },
    };
  }
  if (score === 2) {
    return {
      score: 2,
      label: 'Fair',
      barColor: 'bg-orange-500',
      textColor: 'text-orange-500',
      percent: 50,
      checks: { length: hasLength, case: hasCase, number: hasNumber, special: hasSpecial },
    };
  }
  if (score === 3) {
    return {
      score: 3,
      label: 'Good',
      barColor: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      percent: 75,
      checks: { length: hasLength, case: hasCase, number: hasNumber, special: hasSpecial },
    };
  }
  return {
    score: 4,
    label: 'Strong',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    percent: 100,
    checks: { length: hasLength, case: hasCase, number: hasNumber, special: hasSpecial },
  };
}

export default function CreatorForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'EMAIL' | 'VERIFY_OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const strength = getPasswordStrength(newPassword);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'VERIFY_OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Step 1: Send OTP to email
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot-password',
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to dispatch verification code.');
        setLoading(false);
        return;
      }

      setStep('VERIFY_OTP');
      setCountdown(60);
      setCanResend(false);
    } catch {
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify the 6-digit OTP
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (code.trim().length !== 6) {
      setError('Please enter the 6-digit code received in your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-otp',
          email: email.trim().toLowerCase(),
          code: code.trim(),
          purpose: 'PASSWORD_RESET',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid or expired verification code.');
        setLoading(false);
        return;
      }

      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      setStep('NEW_PASSWORD');
    } catch {
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Set New Password (only accessible when OTP is verified)
  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset-password',
          email: email.trim().toLowerCase(),
          token: resetToken || undefined,
          code: resetToken ? undefined : code.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update password.');
        setLoading(false);
        return;
      }

      setStep('SUCCESS');
      setTimeout(() => {
        router.push('/auth/creator/sign-in');
      }, 2000);
    } catch {
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot-password',
          email: email.trim().toLowerCase(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to resend code.');
        return;
      }

      setCountdown(60);
      setCanResend(false);
    } catch {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      badgeText="Creator Portal"
      title="Reset Password"
      subtitle={
        step === 'EMAIL'
          ? 'Enter your creator email to receive a secure 6-digit recovery code.'
          : step === 'VERIFY_OTP'
          ? `Enter the 6-digit verification code sent to ${email}.`
          : step === 'NEW_PASSWORD'
          ? 'Verification successful! Set your new account password.'
          : 'Your password has been successfully updated.'
      }
    >
      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Step 1: Email Input */}
      {step === 'EMAIL' && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider mb-1.5">
              Creator Email
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Sending code...' : 'Send Recovery Code'}
          </button>

          <div className="pt-3 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-fg-secondary)]">
            Remember your password?{' '}
            <Link href="/auth/creator/sign-in" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      )}

      {/* Step 2: Verify OTP Only */}
      {step === 'VERIFY_OTP' && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider">
                6-Digit Reset Code
              </label>
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                className="text-xs text-brand-600 hover:underline cursor-pointer"
              >
                Change email
              </button>
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 586917"
              className="w-full h-12 px-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-lg font-mono tracking-widest text-center text-[var(--color-fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.trim().length !== 6}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying code...' : 'Verify Code'}
          </button>

          <div className="pt-2 flex items-center justify-between text-xs text-[var(--color-fg-secondary)]">
            <span>Didn&apos;t receive code?</span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || loading}
              className={`font-semibold ${
                canResend
                  ? 'text-brand-600 dark:text-brand-400 hover:underline cursor-pointer'
                  : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Set New Password (Shows ONLY after OTP is Verified) */}
      {step === 'NEW_PASSWORD' && (
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <span>✓</span> Code verified successfully. Choose your new password.
          </div>

          {/* New Password input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider">
                New Password
              </label>
              {newPassword && (
                <span className={`text-xs font-bold ${strength.textColor}`}>
                  {strength.label}
                </span>
              )}
            </div>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            {/* Live Strength Progress Bar */}
            {newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.barColor}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                  <span className={strength.checks.length ? 'text-emerald-500 font-medium' : 'text-slate-400'}>
                    {strength.checks.length ? '✓' : '○'} 8+ characters
                  </span>
                  <span className={strength.checks.case ? 'text-emerald-500 font-medium' : 'text-slate-400'}>
                    {strength.checks.case ? '✓' : '○'} Upper & lower case
                  </span>
                  <span className={strength.checks.number ? 'text-emerald-500 font-medium' : 'text-slate-400'}>
                    {strength.checks.number ? '✓' : '○'} Number (0-9)
                  </span>
                  <span className={strength.checks.special ? 'text-emerald-500 font-medium' : 'text-slate-400'}>
                    {strength.checks.special ? '✓' : '○'} Symbol (!@#$)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[var(--color-fg-primary)] uppercase tracking-wider">
                Confirm New Password
              </label>
              {confirmPassword && (
                <span
                  className={`text-xs font-semibold ${
                    newPassword === confirmPassword ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Do not match'}
                </span>
              )}
            </div>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface-2)] border text-sm text-[var(--color-fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                confirmPassword && newPassword !== confirmPassword
                  ? 'border-red-500/50'
                  : 'border-[var(--color-border)]'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !newPassword || newPassword !== confirmPassword || newPassword.length < 8}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving password...' : 'Set New Password'}
          </button>
        </form>
      )}

      {/* Step 4: Success Message */}
      {step === 'SUCCESS' && (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl mx-auto">
            ✓
          </div>
          <h3 className="text-base font-bold text-[var(--color-fg-primary)]">
            Password Updated!
          </h3>
          <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
            Your password has been securely updated. Redirecting to sign in...
          </p>
          <div className="pt-4 border-t border-[var(--color-border)]">
            <Link
              href="/auth/creator/sign-in"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Click here if you are not redirected
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
