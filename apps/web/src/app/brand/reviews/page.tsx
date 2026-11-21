import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandReviewsPage() {
  return (
    <BrandPageContainer
      title="Reviews & Ratings"
      category="TRUST"
      description="Creator collaboration reviews, communication ratings and reliability scores"
      iconName="Star"
    >
      <BrandEmptyState
        title="No Reviews Submitted"
        description="Ratings and feedback are collected bilaterally after deliverables are approved and milestones are released."
        iconName="Star"
      />
    </BrandPageContainer>
  );
}
