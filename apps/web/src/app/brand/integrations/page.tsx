import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandIntegrationsPage() {
  return (
    <BrandPageContainer
      title="Integrations & API"
      category="WORKSPACE"
      description="Webhooks, ERP/CRM connections and developer API credentials"
      iconName="Cpu"
    >
      <BrandEmptyState
        title="Zero External Integrations Connected"
        description="Connect outbound webhooks, Slack notification channels, and export campaign data to your enterprise accounting software."
        iconName="Cpu"
      />
    </BrandPageContainer>
  );
}
