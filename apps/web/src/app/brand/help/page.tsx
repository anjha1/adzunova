import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandHelpPage() {
  return (
    <BrandPageContainer
      title="Help Center"
      category="SUPPORT"
      description="Enterprise documentation, creator workflow guides and best practices"
      iconName="LifeBuoy"
    >
      <BrandEmptyState
        title="Knowledge Base"
        description="Access enterprise guides on creator pricing benchmarks, contract milestones, milestone escrow, and campaign optimization."
        iconName="LifeBuoy"
      />
    </BrandPageContainer>
  );
}
