'use client';

import React, { useState } from 'react';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function SettingsPage() {
  const [currency, setCurrency] = useState('INR');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
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
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ShellIcon name="Save" size={14} />
            {isSaved ? 'Settings Saved!' : 'Save Preferences'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Payout & Currency */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Currency & Financial Defaults</h3>
            <StatusBadge variant="success" label="Active" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Default Invoicing Currency</label>
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
              <span className="font-semibold text-foreground block mb-1">Tax & KYC Identification</span>
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Permanent Account Number (PAN):</span>
                  <span className="font-mono font-bold text-foreground">ABCDE****F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">TDS Exemption / Category:</span>
                  <span className="font-semibold text-foreground">Section 194J (Professional)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Routing */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Real-Time Deal Notifications</h3>
            <span className="text-xs text-muted-foreground">Instant Alerts</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
              <div>
                <span className="font-semibold text-foreground block">Email Notifications</span>
                <span className="text-muted-foreground text-[11px]">Receive deal offers, contract invites, and escrow release alerts.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
              <div>
                <span className="font-semibold text-foreground block">WhatsApp Business Alerts</span>
                <span className="text-muted-foreground text-[11px]">Instant ping when a brand funds escrow or requests deliverable review.</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Security & Sessions */}
        <div className="desk:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Security & Active Sessions</h3>
            <StatusBadge variant="success" label="OIDC Protected" />
          </div>

          <div className="flex flex-col desk:flex-row desk:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-foreground block">Google Single Sign-On Active</span>
              <p className="text-muted-foreground mt-0.5">
                Your account is protected with Google OAuth 2.0 with PKCE and hardware 2FA keys.
              </p>
            </div>

            <button
              onClick={() => alert('Signing out of all other remote device sessions...')}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-medium shrink-0"
            >
              Sign Out All Other Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
