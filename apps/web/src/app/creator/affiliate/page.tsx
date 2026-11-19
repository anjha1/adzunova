'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface AffiliateProgram {
  id: string;
  brandName: string;
  category: string;
  commissionType: string;
  commissionRate: string;
  cookieDuration: string;
  slug: string;
  totalClicks: number;
  conversions: number;
  earnedMinorUnits: number;
  isActive: boolean;
}

const DEFAULT_PROGRAMS: AffiliateProgram[] = [
  {
    id: 'aff-1',
    brandName: 'Nordic Audio Tech',
    category: 'Consumer Tech',
    commissionType: 'Revenue Share',
    commissionRate: '12% per sale',
    cookieDuration: '30 Days',
    slug: 'nordic-audio',
    totalClicks: 1420,
    conversions: 38,
    earnedMinorUnits: 2840000, // ₹28,400
    isActive: true,
  },
  {
    id: 'aff-2',
    brandName: 'FitPro Nutrition',
    category: 'Health & Fitness',
    commissionType: 'Flat Bounty',
    commissionRate: '₹450 per first order',
    cookieDuration: '45 Days',
    slug: 'fitpro-whey',
    totalClicks: 890,
    conversions: 24,
    earnedMinorUnits: 1080000, // ₹10,800
    isActive: true,
  },
];

export default function AffiliatePage() {
  const [programs] = useState<AffiliateProgram[]>(DEFAULT_PROGRAMS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalEarnedMinor = programs.reduce((acc, p) => acc + p.earnedMinorUnits, 0);
  const totalClicks = programs.reduce((acc, p) => acc + p.totalClicks, 0);
  const totalConversions = programs.reduce((acc, p) => acc + p.conversions, 0);
  const avgConversionRate = ((totalConversions / totalClicks) * 100).toFixed(1);

  const handleCopyLink = (slug: string, id: string) => {
    const url = `https://adzunova.com/r/creator/${slug}?ref=creator_dashboard`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Affiliate & Commission Hub"
        description="Earn ongoing passive commissions by sharing verified affiliate tracking links in your video descriptions, reels, and bios."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Affiliate Commissions"
          value={<Money minorUnits={totalEarnedMinor} currency="INR" />}
          subValue="Total revenue generated"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Audience Clicks"
          value={totalClicks.toLocaleString()}
          subValue="Tracked unique visits"
          icon={<ShellIcon name="ExternalLink" size={16} />}
        />
        <StatCard
          label="Completed Orders"
          value={totalConversions}
          subValue="Verified purchases"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
        <StatCard
          label="Conversion Rate"
          value={`${avgConversionRate}%`}
          subValue="Clicks to purchases"
          icon={<ShellIcon name="BarChart2" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Active Partner Affiliate Programs</h2>
          <span className="text-xs text-muted-foreground">Deterministic First-Party Cookie Tracking</span>
        </div>

        <div className="space-y-3">
          {programs.map((program) => (
            <div
              key={program.id}
              className="p-4 rounded-xl border border-border bg-card hover:border-border/80 transition flex flex-col desk:flex-row desk:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">{program.brandName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {program.category}
                  </span>
                  <StatusBadge variant="success" label="Active Link" />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>Commission: <strong className="text-foreground">{program.commissionRate}</strong></span>
                  <span>Cookie Window: {program.cookieDuration}</span>
                  <span>Conversions: {program.conversions}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">Commission Earned</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <Money minorUnits={program.earnedMinorUnits} currency="INR" />
                  </span>
                </div>

                <button
                  onClick={() => handleCopyLink(program.slug, program.id)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <ShellIcon name="Copy" size={14} />
                  {copiedId === program.id ? 'Copied Link!' : 'Copy Tracking Link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
