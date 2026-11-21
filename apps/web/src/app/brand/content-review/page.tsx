import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandContentReviewPage() {
  return (
    <BrandPageContainer
      title="Content Review"
      category="WORK"
      description="Creator draft submissions, revision feedback cycles and final script approvals"
      iconName="CheckSquare"
    >
      <BrandEmptyState
        title="Zero Pending Approvals"
        description="When creators submit draft video reels, posts, or stories for campaign milestones, you can review and approve them here."
        iconName="CheckSquare"
      />
    </BrandPageContainer>
  );
}
