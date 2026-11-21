import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';
import { getSession } from '@/lib/auth';

export default async function BrandFinancePage() {
  const session = await getSession();
  const currency = session?.profile?.currency || 'INR';

  return (
    <BrandPageContainer
      title="Wallet & Escrow"
      category="FINANCE"
      description="Workspace wallet balance, milestone escrow locks, releases and payout accounting"
      iconName="CreditCard"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground">Available Balance</span>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(0)}
            </div>
            <span className="text-[10px] text-muted-foreground">Settled workspace funds</span>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground">In Milestone Escrow</span>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(0)}
            </div>
            <span className="text-[10px] text-muted-foreground">Allocated to active milestones</span>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground">Total Disbursed</span>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(0)}
            </div>
            <span className="text-[10px] text-muted-foreground">Completed campaign payouts</span>
          </div>
        </div>

        <BrandEmptyState
          title="No Transaction History"
          description="Workspace financial transactions, campaign escrow deposits, and payout receipts will be tracked here with immutable audit trails."
          iconName="CreditCard"
        />
      </div>
    </BrandPageContainer>
  );
}
