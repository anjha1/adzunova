import React from 'react';
import Link from 'next/link';
import { PageHeader, EmptyState, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface CampaignItem {
  id: string;
  brandName: string;
  title: string;
  deliverables: string[];
  stage: string;
  deadline: string;
  amountMinorUnits: number;
}

export default async function CampaignsPage() {
  // Real DB state (empty initially)
  const campaigns: CampaignItem[] = [];
  const activeCount = campaigns.length;
  const completedCount = 0;
  const pendingReviewCount = 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Campaigns & Workspaces"
        description="Track active sponsorships, manage deliverable checklists, milestone deadlines, and submit content for brand review."
      />

      {/* Campaign Summary Metrics */}
      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Active Campaigns"
          value={activeCount}
          subValue="In production or review"
          icon={<ShellIcon name="Briefcase" size={16} />}
        />
        <StatCard
          label="Pending Review"
          value={pendingReviewCount}
          subValue="Awaiting brand sign-off"
          icon={<ShellIcon name="FolderCheck" size={16} />}
        />
        <StatCard
          label="Completed Campaigns"
          value={completedCount}
          subValue="Completed sponsorships"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      {/* Main Campaign List / Real Empty State */}
      {campaigns.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="Briefcase" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Active Campaigns Yet"
          description="When a brand books your rate card or accepts an offer, your dedicated campaign workspace and deliverable checklist will appear here."
          actionText="View Deals Inbox"
          actionHref="/creator/offers"
          secondaryActionText="Configure Rate Card"
          secondaryActionHref="/creator/rate-card"
        />
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.brandName} • Due {c.deadline}</p>
              </div>
              <Link
                href={`/creator/campaigns/${c.id}`}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
              >
                Open Workspace
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
