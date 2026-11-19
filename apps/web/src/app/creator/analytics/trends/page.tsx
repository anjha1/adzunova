'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface TrendItem {
  id: string;
  topic: string;
  category: string;
  growth: string;
  brandBudgetDemand: 'Very High' | 'High' | 'Rising';
  suggestedFormats: string[];
}

const TREND_DATA: TrendItem[] = [
  {
    id: 't-1',
    topic: 'AI Hardware & Snapdragon Laptops',
    category: 'Consumer Tech',
    growth: '+140% QoQ',
    brandBudgetDemand: 'Very High',
    suggestedFormats: ['Dedicated Benchmark Review', 'Side-by-side Battery Comparison'],
  },
  {
    id: 't-2',
    topic: 'Clean Protein & Clean-Label Supplements',
    category: 'Fitness & Health',
    growth: '+88% QoQ',
    brandBudgetDemand: 'High',
    suggestedFormats: ['Full Day of Eating Reel', 'Ingredients Breakdown Short'],
  },
  {
    id: 't-3',
    topic: 'Minimalist EDC & Desk Setups',
    category: 'Productivity',
    growth: '+65% QoQ',
    brandBudgetDemand: 'High',
    suggestedFormats: ['Aesthetic Desk Tour', 'Instagram Carousel Guide'],
  },
];

export default function TrendsPage() {
  const [trends] = useState<TrendItem[]>(TREND_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = trends.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Trend Explorer & Brand Demand"
        description="Real-time advertiser demand signals and high-growth content formats in your category."
      />

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Highest Demand Niche"
          value="AI & Consumer Tech"
          subValue="+140% Brand Budget Inflow"
          icon={<ShellIcon name="Flame" size={16} />}
        />
        <StatCard
          label="Top Converting Format"
          value="30-60s Reels"
          subValue="Highest sponsor click-through"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Q4 Festive Surge"
          value="Active Season"
          subValue="Higher CPMs through December"
          icon={<ShellIcon name="Calendar" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Surging Content Topics & Advertiser Budgets</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter Niche:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs rounded-lg border border-border bg-card px-2.5 py-1 text-foreground"
            >
              <option value="all">All Niches</option>
              <option value="tech">Consumer Tech</option>
              <option value="fitness">Fitness & Health</option>
              <option value="productivity">Productivity</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((trend) => (
            <div
              key={trend.id}
              className="p-4 rounded-xl border border-border bg-card hover:border-border/80 transition space-y-3"
            >
              <div className="flex flex-col desk:flex-row desk:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{trend.topic}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {trend.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {trend.growth}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Brand Budget:</span>
                  <StatusBadge
                    variant={trend.brandBudgetDemand === 'Very High' ? 'danger' : 'warning'}
                    label={trend.brandBudgetDemand}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Recommended Formats for Deals:</span>
                <div className="flex flex-wrap gap-1.5">
                  {trend.suggestedFormats.map((fmt, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium text-foreground">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
