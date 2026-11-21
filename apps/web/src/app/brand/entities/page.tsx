import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';
import { getSession } from '@/lib/auth';

export default async function BrandEntitiesPage() {
  const session = await getSession();
  const companyName = session?.profile?.companyName || 'Primary Workspace';

  return (
    <BrandPageContainer
      title="Brands & Entities"
      category="WORKSPACE"
      description="Agency multi-brand workspaces, subsidiary entities and client portfolio routing"
      iconName="Layers"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Primary Entity
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-foreground">{companyName}</div>
              <div className="text-xs text-muted-foreground">Default billing & contract entity</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-primary/10 text-primary">
              Default
            </span>
          </div>
        </div>

        <BrandEmptyState
          title="Multi-Brand Agency Client Management"
          description="Agencies can add separate client workspaces, assigning dedicated campaign managers and isolated budget allocations per client."
          iconName="Layers"
        />
      </div>
    </BrandPageContainer>
  );
}
