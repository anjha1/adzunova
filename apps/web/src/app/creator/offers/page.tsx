import React from 'react';
import Link from 'next/link';
import { PageHeader, EmptyState, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface OfferItem {
  id: string;
  brandName: string;
  title: string;
  format: string;
  amountMinorUnits: number;
  expiresIn: string;
  status: 'NEW' | 'NEGOTIATING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
}

export default async function OffersPage() {
  const offers: OfferItem[] = []; // Real state

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Offers & Deal Inbox"
        description="Review inbound brand sponsorships, negotiate deliverables and pricing, submit counter-proposals, and accept verified bookings."
      />

      <div className="grid grid-cols-2 desk:grid-cols-4 gap-4">
        <StatCard label="New Offers" value={0} subValue="Awaiting your response" icon={<ShellIcon name="Inbox" size={16} />} />
        <StatCard label="Negotiating" value={0} subValue="Counter-offers sent" icon={<ShellIcon name="MessageSquare" size={16} />} />
        <StatCard label="Accepted Deals" value={0} subValue="Confirmed bookings" icon={<ShellIcon name="CheckCircle" size={16} />} />
        <StatCard label="Avg Offer Value" value="₹0" subValue="Across all platforms" icon={<ShellIcon name="Tag" size={16} />} />
      </div>

      {offers.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="Inbox" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Sponsorship Offers Yet"
          description="Inbound deal proposals from brands will appear here with brief details, budget breakdowns, and one-click accept/counter buttons."
          actionText="Publish Rate Card"
          actionHref="/creator/rate-card"
          secondaryActionText="Edit Public Profile"
          secondaryActionHref="/creator/profile"
        />
      ) : (
        <div className="space-y-3">
          {/* List of real offers */}
        </div>
      )}
    </div>
  );
}
