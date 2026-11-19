'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money, EmptyState } from '@/components/creator/ui';
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
  escrowStatus: string;
}

const DEFAULT_CONTRACTS: ContractItem[] = [
  {
    id: 'c-101',
    contractNumber: 'ADZ-CTR-2026-9041',
    brandName: 'Nordic Audio Tech',
    campaignTitle: 'Wireless ANC Headphone Launch',
    dealValueMinor: 6500000, // ₹65,000
    status: 'active',
    deliverablesSummary: '1x YouTube Dedicated Video (8-10m) + 1x Short',
    ipTerms: 'Organic posting on Creator channels + 30-day paid usage whitelist.',
    signedAt: 'Nov 16, 2026',
    escrowStatus: '100% Escrow Funded',
  },
  {
    id: 'c-102',
    contractNumber: 'ADZ-CTR-2026-9055',
    brandName: 'FitPro Nutrition',
    campaignTitle: 'Whey Isolate Q4 Push',
    dealValueMinor: 3500000, // ₹35,000
    status: 'pending_creator',
    deliverablesSummary: '2x Instagram Reels (30-60s) with collaborator tag',
    ipTerms: 'Organic posting + 60-day fitness category exclusivity.',
    escrowStatus: '100% Escrow Funded (Awaiting your signature)',
  },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractItem[]>(DEFAULT_CONTRACTS);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [signingContract, setSigningContract] = useState<ContractItem | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const filteredContracts = contracts.filter((c) => {
    if (activeTab === 'pending') return c.status === 'pending_creator';
    if (activeTab === 'active') return c.status === 'active';
    if (activeTab === 'completed') return c.status === 'completed';
    return true;
  });

  const handleSignContract = (contractId: string) => {
    setIsSigning(true);
    setTimeout(() => {
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId
            ? { ...c, status: 'active', signedAt: 'Today (Digitally Verified)' }
            : c
        )
      );
      setIsSigning(false);
      setSigningContract(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Contracts & Digital Agreements"
        description="Standardized, legally binding master advertising contracts. All agreements guarantee escrow lock before your shoot begins."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Active Contracts"
          value={contracts.filter((c) => c.status === 'active').length}
          subValue="Active deliverable obligations"
          icon={<ShellIcon name="FileText" size={16} />}
        />
        <StatCard
          label="Awaiting Your Sign"
          value={contracts.filter((c) => c.status === 'pending_creator').length}
          subValue="Action required"
          icon={<ShellIcon name="AlertCircle" size={16} />}
        />
        <StatCard
          label="Protected Escrow Value"
          value={
            <Money
              minorUnits={contracts.reduce((acc, c) => acc + c.dealValueMinor, 0)}
              currency="INR"
            />
          }
          subValue="Guaranteed payout funds"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
        <StatCard
          label="Dispute Protection"
          value="100% Covered"
          subValue="Platform mediation included"
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
          {filteredContracts.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-border/80 transition"
            >
              <div className="flex flex-col desk:flex-row desk:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{c.campaignTitle}</h3>
                    <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {c.contractNumber}
                    </span>
                    {c.status === 'pending_creator' ? (
                      <StatusBadge variant="warning" label="Awaiting Your Sign" />
                    ) : (
                      <StatusBadge variant="success" label="Legally Signed & Active" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Brand: <span className="font-semibold text-foreground">{c.brandName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-muted-foreground block">Escrow Protected Value</span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      <Money minorUnits={c.dealValueMinor} currency="INR" />
                    </span>
                  </div>

                  {c.status === 'pending_creator' ? (
                    <button
                      onClick={() => setSigningContract(c)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      Review & Sign Agreement
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Downloading PDF for ${c.contractNumber}`)}
                      className="px-3.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted font-medium flex items-center gap-1.5"
                    >
                      <ShellIcon name="Download" size={14} />
                      Download PDF
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-1 desk:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block font-medium">Deliverables Scope</span>
                  <p className="text-foreground mt-0.5">{c.deliverablesSummary}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">IP & Usage Rights</span>
                  <p className="text-foreground mt-0.5">{c.ipTerms}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Payment & Escrow Status</span>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    🛡️ {c.escrowStatus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* E-Signature Modal */}
      {signingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Digital E-Sign Agreement</h3>
              <button
                onClick={() => setSigningContract(null)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
              <p className="font-semibold text-foreground">
                Agreement: {signingContract.contractNumber} ({signingContract.campaignTitle})
              </p>
              <p className="text-muted-foreground">
                Brand: <strong className="text-foreground">{signingContract.brandName}</strong> | Amount:{' '}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  <Money minorUnits={signingContract.dealValueMinor} currency="INR" />
                </strong>
              </p>
              <p className="text-[11px] text-muted-foreground">
                By clicking below, you acknowledge and agree to perform the deliverables described within the specified timeline. The brand has already deposited 100% of the funds in secure Adzunova Escrow.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
              <span>✍️ Click to affix digital signature: </span>
              <span className="font-mono font-bold text-foreground">SHA256-DIGITAL-SIGN-CREATOR</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSigningContract(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSigning}
                onClick={() => handleSignContract(signingContract.id)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
              >
                {isSigning ? 'Signing & Stamping...' : 'Confirm Digital Signature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
