import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandCampaignsPage() {
  return (
    <BrandPageContainer
      title="Campaigns"
      category="MAIN"
      description="Manage active campaign briefs, deliverables, timelines and budget spend"
      iconName="Briefcase"
    >
      <BrandEmptyState
        title="No Active Campaigns"
        description="Create your first campaign brief to source proposals, invite creators, and track live deliverable milestones."
        iconName="Briefcase"
        actionLabel="Create Campaign Brief"
        actionHref="/brand/discover"
      />
    </BrandPageContainer>
  );
}
