'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface LedgerEntry {
  id: string;
  txId: string;
  date: string;
  description: string;
  type: string;
  amountMinor: number;
  isCredit: boolean;
  status: string;
}

export default function EarningsPage() {
  const [ledger] = useState<LedgerEntry[]>([]);
  const [availableMinorUnits] = useState(0);
  const [pendingMinorUnits] = useState(0);
  const [lifetimeMinorUnits] = useState(0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Wallet & Payouts"
        description="Track sponsorship disbursements, account balances, and withdrawal requests."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Available for Withdrawal"
          value="₹0"
          subValue="Ready for transfer"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Pending Clearances"
          value="₹0"
          subValue="Awaiting milestone release"
          icon={<ShellIcon name="Clock" size={16} />}
        />
        <StatCard
          label="Lifetime Payouts"
          value="₹0"
          subValue="Total earnings disbursed"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="TDS Withheld"
          value="₹0"
          subValue="Tax withholding receipts"
          icon={<ShellIcon name="FileText" size={16} />}
        />
      </div>

      {/* Ledger Table */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Transaction Ledger</h2>
          <span className="text-xs text-muted-foreground font-mono">Currency: INR</span>
        </div>

        {ledger.length === 0 ? (
          <EmptyState
            icon={<ShellIcon name="CreditCard" size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="No Transactions Yet"
            description="Completed campaign payouts and account withdrawals will appear in your ledger history."
            actionText="View Deals"
            actionHref="/creator/offers"
          />
        ) : (
          <div className="overflow-x-auto">
            {/* Table renders when real transactions exist */}
          </div>
        )}
      </div>
    </div>
  );
}
