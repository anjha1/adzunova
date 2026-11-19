'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface PlanConfig {
  id: string;
  name: string;
  tagline: string;
  priceMinorUnits: number;
  currency: string;
  commissionBps: number;
  features: string[];
}

export default function SubscriptionPage() {
  const [configured, setConfigured] = useState<boolean>(false);
  const [plans, setPlans] = useState<PlanConfig[]>([]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/platform-config');
        if (res.ok) {
          const cfg = await res.json();
          setConfigured(cfg.configured);
          setPlans(cfg.plans || []);
        }
      } catch {
        setConfigured(false);
      }
    }
    loadConfig();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Membership & Plan"
        description="Review your active membership tier and platform service fee rates."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Current Plan */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Standard Creator Tier</h3>
                <p className="text-xs text-muted-foreground">Standard marketplace access and deal workflow</p>
              </div>
              <StatusBadge variant="neutral" label="Current Plan" />
            </div>

            <div className="text-3xl font-black text-foreground">
              {configured ? '₹0' : 'Pricing not configured'}
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>Standard platform service fee</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>Rate card builder & deliverable tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                <span>Direct brand messaging and proposal tools</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
            {configured
              ? 'Active membership: Standard tier.'
              : 'Pricing not configured. Paid subscription tiers are not currently active.'}
          </div>
        </div>
      </div>
    </div>
  );
}
