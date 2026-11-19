'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface DeliverableAsset {
  id: string;
  campaignTitle: string;
  brandName: string;
  format: string;
  version: string;
  fileName: string;
  fileSize: string;
  status: 'draft' | 'submitted' | 'changes_requested' | 'approved';
  uploadedAt: string;
  brandFeedback?: string;
}

export default function ContentVaultPage() {
  const [assets] = useState<DeliverableAsset[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAssets = assets.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Content Vault & Deliverables"
        description="Upload video drafts, submit revision cuts, and collect timestamped sign-offs from brand marketing teams."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Deliverable Files"
          value={assets.length}
          subValue="Across active campaigns"
          icon={<ShellIcon name="FolderCheck" size={16} />}
        />
        <StatCard
          label="Pending Sign-off"
          value={assets.filter((a) => a.status === 'submitted').length}
          subValue="Under brand review"
          icon={<ShellIcon name="Clock" size={16} />}
        />
        <StatCard
          label="Revisions Requested"
          value={assets.filter((a) => a.status === 'changes_requested').length}
          subValue="Action needed"
          icon={<ShellIcon name="AlertCircle" size={16} />}
        />
        <StatCard
          label="Approved Content"
          value={assets.filter((a) => a.status === 'approved').length}
          subValue="Ready for live publishing"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-xs">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'submitted', label: 'Under Review' },
          { id: 'changes_requested', label: 'Needs Revision' },
          { id: 'approved', label: 'Approved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterStatus === tab.id
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="FolderCheck" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Deliverable Assets Found"
          description="Upload media files or script treatments once you have an active campaign workspace."
          actionText="View Active Campaigns"
          actionHref="/creator/campaigns"
        />
      ) : (
        <div className="space-y-4">
          {/* Real deliverable assets render here */}
        </div>
      )}
    </div>
  );
}
