import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandSafetyPage() {
  return (
    <BrandPageContainer
      title="Brand Safety & Compliance"
      category="WORKSPACE"
      description="Content safety guidelines, competitor negative targeting lists and domain verification controls"
      iconName="ShieldCheck"
    >
      <BrandEmptyState
        title="Brand Safety Engine"
        description="Configure automated content guidelines, competitor exclusions, and prohibited niche filters across all creator outreach."
        iconName="ShieldCheck"
      />
    </BrandPageContainer>
  );
}
