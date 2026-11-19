'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface ContractItem {
  id: string;
  contractNumber: string;
  brandName: string;
  campaignTitle: string;
  dealValueMinor: number;
  status: 'pending_creator' | 'active' | 'completed' | 'draft';
  deliverablesSummary: string;
  ipTerms: string;
  signedAt?: string;
}

export default function ContractsPage() {
  const [contracts] = useState<ContractItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  const filteredContracts = contracts.filter((c) => {
    if (activeTab === 'pending') return c.status === 'pending_creator';
    if (activeTab === 'active') return c.status === 'active';
    if (activeTab === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Contracts & Digital Agreements"
        description="Standardized digital agreements between creators and verified brands. Deliverable milestones, licensing terms, and payout conditions."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Active Contracts"
          value={contracts.filter((c) => c.status === 'active').length}
          subValue="Active deliverable obligations"
          icon={<ShellIcon name="FileText" size={16} />}
        />
        <StatCard
          label="Awaiting Signature"
          value={contracts.filter((c) => c.status === 'pending_creator').length}
          subValue="Action required"
          icon={<ShellIcon name="AlertCircle" size={16} />}
        />
        <StatCard
          label="Contract Value"
          value="₹0"
          subValue="Total active agreements"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Completed Contracts"
          value={contracts.filter((c) => c.status === 'completed').length}
          subValue="Fully settled agreements"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-xs">
        {(['all', 'pending', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
              activeTab === tab
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'pending' ? 'Pending Signature' : tab}
          </button>
        ))}
      </div>

      {filteredContracts.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="FileText" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Contracts Found"
          description="Agreements are generated automatically when a brand accepts your rate card quote or offer terms."
          actionText="View Deals"
          actionHref="/creator/offers"
        />
      ) : (
        <div className="space-y-4">
          {/* Contracts list renders when contracts exist */}
        </div>
      )}
    </div>
  );
}
