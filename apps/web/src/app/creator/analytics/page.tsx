'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader, StatCard, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m'>('30d');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Verified Audience Analytics"
        description="First-party verified metrics ingested via Google YouTube & Meta Graph OAuth. Never manual or self-reported."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-xs rounded-lg border border-border bg-card px-2.5 py-1 text-foreground"
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
        }
      />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Total Verified Reach"
          value="482.5K"
          subValue="+8.4% vs last period"
          icon={<ShellIcon name="Users" size={16} />}
        />
        <StatCard
          label="Avg Engagement Rate"
          value="4.92%"
          subValue="Industry benchmark: 2.8%"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Total Monthly Views"
          value="1.24M"
          subValue="YouTube & Instagram combined"
          icon={<ShellIcon name="Eye" size={16} />}
        />
        <StatCard
          label="Audience Quality Score"
          value="94 / 100"
          subValue="Top 5% authentic engagement"
          icon={<ShellIcon name="Award" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-6">
        {/* Audience Age & Gender Demographics */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Age Distribution</h3>
            <span className="text-[11px] text-muted-foreground">OAuth Ingested</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { age: '18-24 years', percent: 42, color: 'bg-indigo-600' },
              { age: '25-34 years', percent: 38, color: 'bg-indigo-500' },
              { age: '35-44 years', percent: 14, color: 'bg-indigo-400' },
              { age: '45+ years', percent: 6, color: 'bg-indigo-300' },
            ].map((group) => (
              <div key={group.age} className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>{group.age}</span>
                  <span className="font-semibold text-foreground">{group.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${group.color}`}
                    style={{ width: `${group.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Geographic Markets */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Top Geographies</h3>
            <span className="text-[11px] text-muted-foreground">Verified Country Split</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { country: 'India (Tier 1 & 2 Metro)', percent: 64, flag: '🇮🇳' },
              { country: 'United States', percent: 18, flag: '🇺🇸' },
              { country: 'United Kingdom', percent: 9, flag: '🇬🇧' },
              { country: 'United Arab Emirates', percent: 5, flag: '🇦🇪' },
              { country: 'Other International', percent: 4, flag: '🌍' },
            ].map((item) => (
              <div key={item.country} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span className="text-foreground font-medium">{item.country}</span>
                </div>
                <span className="font-bold text-foreground">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Platform Weight</h3>
            <Link
              href="/creator/accounts"
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sync Status →
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <ShellIcon name="Video" size={14} className="text-red-500" />
                  <span>YouTube Channel</span>
                </div>
                <span>310K Subscribers</span>
              </div>
              <p className="text-[11px] text-muted-foreground">8.2m total views • 12.4m minutes watch time</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <ShellIcon name="Share2" size={14} className="text-pink-500" />
                  <span>Instagram Profile</span>
                </div>
                <span>172.5K Followers</span>
              </div>
              <p className="text-[11px] text-muted-foreground">5.8% reel engagement • 24.5k avg story views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
