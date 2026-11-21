import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandOffersPage() {
  return (
    <BrandPageContainer
      title="Offers & Bookings"
      category="WORK"
      description="Direct booking requests, customized deliverables and inbound creator proposals"
      iconName="Inbox"
    >
      <BrandEmptyState
        title="No Pending Offers"
        description="Direct booking requests and formal creator proposals with deliverable terms will appear here."
        iconName="Inbox"
        actionLabel="Discover Talent"
        actionHref="/brand/discover"
      />
    </BrandPageContainer>
  );
}
