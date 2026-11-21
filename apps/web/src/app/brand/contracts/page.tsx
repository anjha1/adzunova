import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandContractsPage() {
  return (
    <BrandPageContainer
      title="Contracts"
      category="WORK"
      description="Executed agreements, licensing terms, usage rights and non-disclosure terms"
      iconName="FileText"
    >
      <BrandEmptyState
        title="No Executed Contracts"
        description="Legal contracts and deliverable agreements generated upon offer acceptance will be securely stored with audit logs."
        iconName="FileText"
      />
    </BrandPageContainer>
  );
}
