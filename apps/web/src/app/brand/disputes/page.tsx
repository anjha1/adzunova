import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandDisputesPage() {
  return (
    <BrandPageContainer
      title="Disputes & Resolution"
      category="TRUST"
      description="Formal arbitration tickets, deliverable non-compliance reviews and milestone freezes"
      iconName="Scale"
    >
      <BrandEmptyState
        title="Zero Active Disputes"
        description="Your workspace has a clean record with no active arbitration cases or disputed milestone claims."
        iconName="Scale"
      />
    </BrandPageContainer>
  );
}
