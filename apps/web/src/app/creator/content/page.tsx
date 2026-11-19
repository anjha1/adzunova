'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, EmptyState } from '@/components/creator/ui';
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

const DEFAULT_ASSETS: DeliverableAsset[] = [
  {
    id: 'asset-1',
    campaignTitle: 'Wireless ANC Headphone Launch',
    brandName: 'Nordic Audio Tech',
    format: 'YouTube Video (4K ProRes)',
    version: 'V2 (Final Master)',
    fileName: 'nordic_anc_review_master_v2.mp4',
    fileSize: '1.42 GB',
    status: 'submitted',
    uploadedAt: 'Today, 9:30 AM',
    brandFeedback: 'Under brand marketing team review. SLA: 24h response.',
  },
  {
    id: 'asset-2',
    campaignTitle: 'Wireless ANC Headphone Launch',
    brandName: 'Nordic Audio Tech',
    format: 'YouTube Short',
    version: 'V1',
    fileName: 'short_anc_metro_test.mp4',
    fileSize: '124 MB',
    status: 'changes_requested',
    uploadedAt: 'Yesterday, 3:15 PM',
    brandFeedback: 'Could you make the brand logo slightly larger in the first 3 seconds?',
  },
  {
    id: 'asset-3',
    campaignTitle: 'Whey Isolate Q4 Push',
    brandName: 'FitPro Nutrition',
    format: 'Instagram Reel',
    version: 'V1 Script & Storyboard',
    fileName: 'fitpro_script_storyboard.pdf',
    fileSize: '4.8 MB',
    status: 'approved',
    uploadedAt: 'Nov 15, 2026',
    brandFeedback: 'Approved! You can proceed with recording the reel.',
  },
];

export default function ContentVaultPage() {
  const [assets, setAssets] = useState<DeliverableAsset[]>(DEFAULT_ASSETS);
  const [isUploading, setIsUploading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAssets = assets.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const handleUploadMock = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newAsset: DeliverableAsset = {
        id: `asset-${Date.now()}`,
        campaignTitle: 'Wireless ANC Headphone Launch',
        brandName: 'Nordic Audio Tech',
        format: 'YouTube Short',
        version: 'V2 Revision',
        fileName: 'short_anc_metro_test_v2_fixed.mp4',
        fileSize: '130 MB',
        status: 'submitted',
        uploadedAt: 'Just now',
        brandFeedback: 'Submitted for brand review. Brand has 48h to respond.',
      };
      setAssets([newAsset, ...assets]);
      setIsUploading(false);
    }, 1500);
  };

  const getStatusBadge = (status: DeliverableAsset['status']) => {
    switch (status) {
      case 'approved':
        return <StatusBadge variant="success" label="Approved by Brand" />;
      case 'submitted':
        return <StatusBadge variant="info" label="Submitted for Review" />;
      case 'changes_requested':
        return <StatusBadge variant="warning" label="Revisions Requested" />;
      case 'draft':
        return <StatusBadge variant="neutral" label="Draft" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Content Vault & Deliverables"
        description="Upload video drafts, submit revision cuts, and collect timestamped sign-offs from brand marketing teams."
        action={
          <button
            onClick={handleUploadMock}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ShellIcon name="Upload" size={14} />
            {isUploading ? 'Uploading Media Asset...' : 'Upload Deliverable File'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Total Deliverable Files"
          value={assets.length}
          subValue="Across all active campaigns"
          icon={<ShellIcon name="FolderCheck" size={16} />}
        />
        <StatCard
          label="Pending Brand Sign-off"
          value={assets.filter((a) => a.status === 'submitted').length}
          subValue="Awaiting escrow trigger"
          icon={<ShellIcon name="Clock" size={16} />}
        />
        <StatCard
          label="Revisions Requested"
          value={assets.filter((a) => a.status === 'changes_requested').length}
          subValue="Action needed from you"
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
          description="Upload media files or script treatments for your active campaigns to request brand approval."
          actionText="Upload Deliverable"
          onAction={handleUploadMock}
        />
      ) : (
        <div className="space-y-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-border/80 transition"
            >
              <div className="flex flex-col desk:flex-row desk:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    <ShellIcon name="Video" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{asset.fileName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {asset.version}
                      </span>
                      {getStatusBadge(asset.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Campaign: <strong className="text-foreground">{asset.campaignTitle}</strong> • {asset.brandName}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span>📦 {asset.fileSize}</span>
                      <span>Format: {asset.format}</span>
                      <span>Uploaded {asset.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Opening stream preview for ${asset.fileName}`)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted font-medium flex items-center gap-1.5"
                  >
                    <ShellIcon name="Eye" size={14} />
                    Preview
                  </button>
                  <button
                    onClick={() => alert(`Downloading ${asset.fileName}`)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <ShellIcon name="Download" size={14} />
                    Download Master
                  </button>
                </div>
              </div>

              {asset.brandFeedback && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex items-start gap-2.5">
                  <ShellIcon name="MessageSquare" size={14} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Brand Reviewer Comment:</span>
                    <p className="text-muted-foreground mt-0.5">{asset.brandFeedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
