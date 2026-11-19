'use client';

import React, { useState } from 'react';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Membership & Plan"
        description="Choose the membership tier that fits your creative scale. Creator Pro members enjoy reduced platform fees and priority search placement."
      />

      {/* Billing Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg transition ${
              billingCycle === 'monthly' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Standard Creator</h3>
                <p className="text-xs text-muted-foreground">Essential escrow and deals management</p>
              </div>
              <StatusBadge variant="neutral" label="Current Plan" />
            </div>

            <div className="text-3xl font-black text-foreground">
              ₹0 <span className="text-xs font-normal text-muted-foreground">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>100% Escrow Protection on all bookings</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>Standard 10% platform service fee</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>Verified Public Rate Card & Media Kit</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>Standard direct brand messaging</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl border border-border bg-muted/50 text-xs font-semibold text-muted-foreground cursor-not-allowed"
          >
            Active Plan
          </button>
        </div>

        {/* Creator Pro */}
        <div className="p-6 rounded-2xl bg-card border-2 border-indigo-600 dark:border-indigo-500 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
            Recommended
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Creator Pro</h3>
              <p className="text-xs text-muted-foreground">For full-time creators scaling their brand revenue</p>
            </div>

            <div className="text-3xl font-black text-foreground">
              {billingCycle === 'yearly' ? '₹1,499' : '₹1,899'}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-foreground font-semibold">Reduced 5% platform commission (Halved!)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-foreground font-semibold">Priority placement in Brand Directory & Search</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>AI Brand Pitch Assistant & Rate Card Optimizer</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Instant same-day bank IMPS disbursements</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Dedicated Creator Success Manager</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => alert('Upgrading to Creator Pro via Razorpay...')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
          >
            Upgrade to Creator Pro
          </button>
        </div>
      </div>
    </div>
  );
}
