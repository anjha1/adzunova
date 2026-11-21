import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandTicketsPage() {
  return (
    <BrandPageContainer
      title="Support Tickets"
      category="SUPPORT"
      description="Direct ticketing channel for platform support, SLA tracking and escalation"
      iconName="Ticket"
    >
      <BrandEmptyState
        title="Zero Open Support Tickets"
        description="Submit tickets directly to the Adzunova enterprise operations team for campaign assistance, invoicing queries, or account support."
        iconName="Ticket"
      />
    </BrandPageContainer>
  );
}
