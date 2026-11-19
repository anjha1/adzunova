'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface ReferredCreator {
  id: string;
  name: string;
  handle: string;
  joinedDate: string;
  status: 'verified' | 'pending';
  totalDeals: number;
  bonusEarnedMinor: number;
}

const REFERRED_CREATORS: ReferredCreator[] = [
  {
    id: 'ref-1',
    name: 'Rohan Sharma',
    handle: '@rohangadgets',
    joinedDate: 'Oct 24, 2026',
    status: 'verified',
    totalDeals: 3,
    bonusEarnedMinor: 480000, // ₹4,800
  },
  {
    id: 'ref-2',
    name: 'Priya Patel',
    handle: '@priyacooks',
    joinedDate: 'Nov 02, 2026',
    status: 'verified',
    totalDeals: 1,
    bonusEarnedMinor: 150000, // ₹1,500
  },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [referrals] = useState<ReferredCreator[]>(REFERRED_CREATORS);

  const totalBonusMinor = referrals.reduce((acc, r) => acc + r.bonusEarnedMinor, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://adzunova.com/join?ref=achhutacreative');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Referral Program"
        description="Invite talented creators to Adzunova. Earn 2% of the deal volume they close during their first 12 months, paid automatically."
        action={
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ShellIcon name="Share2" size={14} />
            {copied ? 'Copied Invite Link!' : 'Copy Referral Link'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Total Referral Bonus"
          value={<Money minorUnits={totalBonusMinor} currency="INR" />}
          subValue="Credited to your wallet"
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
          value="2.0% Volume"
          subValue="12-month earnings bonus"
          icon={<ShellIcon name="Award" size={16} />}
        />
        <StatCard
          label="Reward Frequency"
          value="Instant on Escrow"
          subValue="Direct wallet deposit"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Referred Creator Roster</h2>
          <span className="text-xs text-muted-foreground">Real-time referral performance</span>
        </div>

        {referrals.length === 0 ? (
          <EmptyState
            icon={<ShellIcon name="Users" size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="No Referrals Yet"
            description="Share your unique creator invite link with other creators to start earning 2% perpetual revenue bonuses."
            actionText="Copy Invite Link"
            onAction={handleCopy}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Creator</th>
                  <th className="pb-3 font-semibold">Joined Date</th>
                  <th className="pb-3 font-semibold">Verification Status</th>
                  <th className="pb-3 font-semibold">Completed Deals</th>
                  <th className="pb-3 font-semibold text-right">Bonus Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition">
                    <td className="py-3">
                      <span className="font-bold text-foreground block">{r.name}</span>
                      <span className="text-[11px] font-mono text-muted-foreground">{r.handle}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{r.joinedDate}</td>
                    <td className="py-3">
                      <StatusBadge variant="success" label="Verified Creator" />
                    </td>
                    <td className="py-3 font-semibold text-foreground">{r.totalDeals} Deals</td>
                    <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      <Money minorUnits={r.bonusEarnedMinor} currency="INR" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
