'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface AffiliateProgram {
  id: string;
  brandName: string;
  category: string;
  commissionRate: string;
  cookieDuration: string;
  slug: string;
  totalClicks: number;
  conversions: number;
  earnedMinorUnits: number;
}

export default function AffiliatePage() {
  const [programs] = useState<AffiliateProgram[]>([]);

  const totalEarnedMinor = programs.reduce((acc, p) => acc + p.earnedMinorUnits, 0);
  const totalClicks = programs.reduce((acc, p) => acc + p.totalClicks, 0);
  const totalConversions = programs.reduce((acc, p) => acc + p.conversions, 0);
  const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Affiliate & Commission Hub"
        description="Track active partner affiliate links and earn commissions from product recommendations."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Affiliate Commissions"
          value="₹0"
          subValue="Total revenue generated"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Audience Clicks"
          value={totalClicks}
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

      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Active Partner Affiliate Programs</h2>
          <span className="text-xs text-muted-foreground">Commission Tracking</span>
        </div>

        {programs.length === 0 ? (
          <EmptyState
            icon={<ShellIcon name="TrendingUp" size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="No Affiliate Programs Available Yet"
            description="Partner brands will list trackable commission offers here once affiliate campaigns are opened for your creator category."
          />
        ) : (
          <div className="space-y-3">
            {/* List rendered when real data exists */}
          </div>
        )}
      </div>
    </div>
  );
}
