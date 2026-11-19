'use client';

import React, { useState } from 'react';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function SettingsPage() {
  const [currency, setCurrency] = useState('INR');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Account Settings"
        description="Manage your notification routing, default payout currency, tax identification, and security credentials."
        action={
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <ShellIcon name="Save" size={14} />
            {isSaved ? 'Settings Saved!' : 'Save Preferences'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Payout & Currency */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Currency & Financial Defaults</h3>
            <StatusBadge variant="neutral" label="Active" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="INR">INR (Indian Rupee - ₹)</option>
                <option value="USD">USD (US Dollar - $)</option>
                <option value="EUR">EUR (Euro - €)</option>
                <option value="GBP">GBP (British Pound - £)</option>
                <option value="AED">AED (Emirati Dirham - د.إ)</option>
              </select>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                All platform rate cards and deals default to this denomination.
              </span>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="font-semibold text-foreground block mb-1">Tax Identification</span>
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax Identifier (PAN/Tax ID):</span>
                  <span className="font-mono text-muted-foreground">Not provided</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax Verification Status:</span>
                  <span className="font-semibold text-muted-foreground">Unverified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Routing */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Deal Notifications</h3>
            <span className="text-xs text-muted-foreground">Routing</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
              <div>
                <span className="font-semibold text-foreground block">Email Notifications</span>
                <span className="text-muted-foreground text-[11px]">Receive deal offers and contract alerts.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Security & Sessions */}
        <div className="desk:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Security & Sessions</h3>
            <StatusBadge variant="neutral" label="Active" />
          </div>

          <div className="flex flex-col desk:flex-row desk:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-foreground block">Session Security</span>
              <p className="text-muted-foreground mt-0.5">
                Your session is authenticated via httpOnly cookies.
              </p>
            </div>

            <button
              onClick={() => alert('Signing out of all other remote device sessions...')}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-medium shrink-0"
            >
              Sign Out Other Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
