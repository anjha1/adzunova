import React from 'react';
import { BrandPageContainer } from '@/components/brand/shell/brand-page-container';
import { getSession } from '@/lib/auth';

export default async function BrandSettingsPage() {
  const session = await getSession();
  const { user, profile } = session || {};

  return (
    <BrandPageContainer
      title="Workspace Settings"
      category="WORKSPACE"
      description="Corporate legal profile, GSTIN registration, currency and notification preferences"
      iconName="Settings"
    >
      <div className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Account & Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Work Email</span>
              <div className="text-sm font-mono font-semibold text-foreground">{user?.email}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Company Legal Name</span>
              <div className="text-sm font-semibold text-foreground">{profile?.companyName || 'Not configured'}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Billing Currency</span>
              <div className="text-sm font-semibold text-foreground">{profile?.currency || 'INR'}</div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Verification State</span>
              <div className="text-sm font-semibold text-foreground">{profile?.verificationStatus || 'UNVERIFIED'}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Tax & Compliance
          </h2>
          <p className="text-xs text-muted-foreground">
            GSTIN and PAN business verification adapters are configured in Phase D.
          </p>
        </div>
      </div>
    </BrandPageContainer>
  );
}
