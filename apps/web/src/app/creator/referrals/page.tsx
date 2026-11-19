'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface ReferredCreator {
  id: string;
  name: string;
  handle: string;
  joinedDate: string;
  totalDeals: number;
  bonusEarnedMinor: number;
}

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [referrals] = useState<ReferredCreator[]>([]);
  const [referralRate, setReferralRate] = useState<string>('Pricing not configured');

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/platform-config');
        if (res.ok) {
          const cfg = await res.json();
          if (cfg.configured && cfg.referralBps > 0) {
            setReferralRate(`${(cfg.referralBps / 100).toFixed(1)}% Volume`);
          } else {
            setReferralRate('Pricing not configured');
          }
        }
      } catch {
        setReferralRate('Pricing not configured');
      }
    }
    loadConfig();
  }, []);

  const totalBonusMinor = referrals.reduce((acc, r) => acc + r.bonusEarnedMinor, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + '/join?ref=creator');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Referral Program"
        description="Invite creators to Adzunova. Earn a bonus on deal volume closed by creators who join through your link."
        action={
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <ShellIcon name="Share2" size={14} />
            {copied ? 'Copied Invite Link!' : 'Copy Referral Link'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Referral Bonus"
          value="₹0"
          subValue="Total bonuses earned"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Referred Creators"
          value={referrals.length}
          subValue="Joined via your link"
          icon={<ShellIcon name="Users" size={16} />}
        />
        <StatCard
          label="Commission Rate"
          value={referralRate}
          subValue="Platform incentive bonus"
          icon={<ShellIcon name="Award" size={16} />}
        />
        <StatCard
          label="Active Deals"
          value={0}
          subValue="Referred creator deals"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Referred Creator Roster</h2>
          <span className="text-xs text-muted-foreground">Referral Performance</span>
        </div>

        {referrals.length === 0 ? (
          <EmptyState
            icon={<ShellIcon name="Users" size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="No Referrals Yet"
            description="Share your unique creator invite link with other creators to start earning bonuses when they join and complete deals."
            actionText="Copy Invite Link"
            onAction={handleCopy}
          />
        ) : (
          <div className="overflow-x-auto">
            {/* Table rendered when real referrals exist */}
          </div>
        )}
      </div>
    </div>
  );
}
