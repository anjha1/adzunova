import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandInvoicesPage() {
  return (
    <BrandPageContainer
      title="Invoices & Tax"
      category="FINANCE"
      description="GST compliance tax invoices, TDS certificates and monthly billing receipts"
      iconName="Receipt"
    >
      <BrandEmptyState
        title="Zero Invoices Generated"
        description="Formal tax invoices conforming to Indian GST regulations and TDS withholding guidelines will be generated upon milestone completions."
        iconName="Receipt"
        actionLabel="Configure Billing Settings"
        actionHref="/brand/settings"
      />
    </BrandPageContainer>
  );
}
