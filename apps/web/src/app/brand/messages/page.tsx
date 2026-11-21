import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandMessagesPage() {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_BRAND_MESSAGES === 'true';

  return (
    <BrandPageContainer
      title="Messages"
      category="WORK"
      description="Direct workspace communication portal with creators and talent management"
      iconName="MessageSquare"
    >
      {!isEnabled ? (
        <BrandEmptyState
          title="Direct Messaging Restricted"
          description="Workspace direct messaging is currently feature-gated. Collaboration is conducted through structured campaign briefs and deliverable comments."
          iconName="MessageSquare"
          actionLabel="View Active Campaigns"
          actionHref="/brand/campaigns"
        />
      ) : (
        <BrandEmptyState
          title="No Open Conversations"
          description="Direct message threads with creators will appear once offers or bookings are initiated."
          iconName="MessageSquare"
        />
      )}
    </BrandPageContainer>
  );
}
