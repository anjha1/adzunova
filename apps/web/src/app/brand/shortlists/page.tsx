import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandShortlistsPage() {
  return (
    <BrandPageContainer
      title="Shortlists"
      category="MAIN"
      description="Curated rosters, talent groups and campaign candidate bookmarks"
      iconName="Bookmark"
    >
      <BrandEmptyState
        title="No Shortlisted Creators Yet"
        description="Save creators to custom shortlists while browsing the talent directory to compare engagement metrics and build campaign rosters."
        iconName="Bookmark"
        actionLabel="Explore Creators"
        actionHref="/brand/discover"
      />
    </BrandPageContainer>
  );
}
