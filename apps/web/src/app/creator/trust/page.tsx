'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface BrandReview {
  id: string;
  brandName: string;
  campaignTitle: string;
  rating: number;
  date: string;
  comment: string;
}

export default function TrustPage() {
  const [reviews] = useState<BrandReview[]>([]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Reviews & Trust Score"
        description="Verified brand feedback and reliability metrics. Only brands with completed campaign deals can submit reviews."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Creator Trust Score"
          value="—"
          subValue="Not enough data"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
        <StatCard
          label="On-Time Delivery Rate"
          value="—"
          subValue="Not enough data"
          icon={<ShellIcon name="Clock" size={16} />}
        />
        <StatCard
          label="Brand Satisfaction"
          value="—"
          subValue="Not enough data"
          icon={<ShellIcon name="Award" size={16} />}
        />
        <StatCard
          label="Dispute Rate"
          value="—"
          subValue="Not enough data"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Brand Reviews</h2>
          <span className="text-xs text-muted-foreground">Authenticated Deals</span>
        </div>

        {reviews.length === 0 ? (
          <EmptyState
            icon={<ShellIcon name="Award" size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="No Brand Reviews Yet"
            description="Reviews are posted by brand managers after a sponsored campaign is delivered and accepted."
          />
        ) : (
          <div className="space-y-4">
            {/* Reviews render when real data exists */}
          </div>
        )}
      </div>
    </div>
  );
}
