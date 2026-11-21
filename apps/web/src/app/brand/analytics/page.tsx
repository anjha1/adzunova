import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandAnalyticsPage() {
  return (
    <BrandPageContainer
      title="Analytics & Reports"
      category="INSIGHTS"
      description="Aggregated creator ROI, platform-verified views, engagement rates and audience demographics"
      iconName="BarChart2"
    >
      <BrandEmptyState
        title="No Live Campaign Metrics"
        description="Performance reports and audience insights aggregate automatically once active campaigns begin publishing content with tracked deliverables."
        iconName="BarChart2"
        actionLabel="Create Campaign"
        actionHref="/brand/campaigns"
      />
    </BrandPageContainer>
  );
}
