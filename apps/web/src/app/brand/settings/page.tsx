'use client';

import React, { useState } from 'react';
import { BrandPageContainer } from '@/components/brand/shell/brand-page-container';

export default function BrandSettingsPage() {
  const [ipAllowlistText, setIpAllowlistText] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [bookingThresholdRupees, setBookingThresholdRupees] = useState('100000');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const allowlist = ipAllowlistText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setLoading(true);
      const res = await fetch('/api/brand/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipAllowlist: allowlist,
          twoFactorRequired,
          approvalThresholds: {
            bookingThresholdMinor: parseInt(bookingThresholdRupees, 10) * 100,
          },
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to update settings');
      }

      setSuccessMsg('Enterprise security and workspace policies saved.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandPageContainer
      title="Workspace Settings"
      category="WORKSPACE"
      description="Enterprise security policies, IP allowlists, 2FA enforcement, and booking approval thresholds"
      iconName="Settings"
    >
      <div className="max-w-3xl space-y-6">
        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Security & Access Section */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <h2 className="text-sm font-bold text-foreground">Enterprise Security Controls</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorRequired}
                  onChange={(e) => setTwoFactorRequired(e.target.checked)}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <div className="text-xs font-semibold text-foreground">Mandate 2FA for All Teammates</div>
                  <div className="text-[11px] text-muted-foreground">
                    Enforce two-factor authentication on every login for workspace managers and reviewers.
                  </div>
                </div>
              </label>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground">IP Address Allowlist (CIDR notation)</label>
              <textarea
                rows={4}
                placeholder="198.51.100.25&#10;10.0.0.0/8&#10;192.168.1.0/24"
                value={ipAllowlistText}
                onChange={(e) => setIpAllowlistText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                Enter one IP address or CIDR range per line. Leave empty to allow unrestricted access.
              </p>
            </div>
          </div>

          {/* Financial & Approval Thresholds */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h2 className="text-sm font-bold text-foreground">Approval Threshold Configuration</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Default Booking Approval Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={bookingThresholdRupees}
                onChange={(e) => setBookingThresholdRupees(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                Creator offers or bookings above this amount require formal approval from a Finance controller or Admin.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Workspace Policies'}
            </button>
          </div>
        </form>
      </div>
    </BrandPageContainer>
  );
}
