'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface TrendItem {
  id: string;
  topic: string;
  category: string;
  growth: string;
  brandBudgetDemand: string;
  suggestedFormats: string[];
}

export default function TrendsPage() {
  const [trends] = useState<TrendItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Trend Explorer & Brand Demand"
        description="Real-time advertiser demand signals and high-growth content formats across creator categories."
      />

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Highest Demand Niche"
          value="—"
          subValue="Not enough category volume"
          icon={<ShellIcon name="Flame" size={16} />}
        />
        <StatCard
          label="Top Converting Format"
          value="—"
          subValue="Awaiting marketplace deals"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Seasonality Signal"
          value="—"
          subValue="Marketplace signals pending"
          icon={<ShellIcon name="Calendar" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Content Topics & Advertiser Budgets</h2>
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

        {trends.length === 0 ? (
          <EmptyState
            icon={<ShellIcon name="Flame" size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="Trend data is not available yet"
            description="Market demand signals will be shown once sufficient marketplace volume is recorded."
          />
        ) : (
          <div className="space-y-4">
            {/* Real trend data rendered here */}
          </div>
        )}
      </div>
    </div>
  );
}
