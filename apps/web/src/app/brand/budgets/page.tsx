import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

export default function BrandBudgetsPage() {
  return (
    <BrandPageContainer
      title="Budgets"
      category="FINANCE"
      description="Quarterly spend limits, brand entity allocations and campaign ceiling controls"
      iconName="PieChart"
    >
      <BrandEmptyState
        title="No Budget Limits Defined"
        description="Define spend caps and multi-brand budget limits to prevent accidental overages across creator collaborations."
        iconName="PieChart"
      />
    </BrandPageContainer>
  );
}
