import React from 'react';
import Link from 'next/link';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';
import { getActiveVerifiedCreatorCount } from '@/lib/social/social-repository';

export default async function BrandDiscoverPage() {
  const verifiedCount = await getActiveVerifiedCreatorCount();

  return (
    <BrandPageContainer
      title="Discover Creators"
      category="MAIN"
      description="Search and filter verified creators with real first-party analytics and rate cards"
      iconName="Compass"
      actions={
        <Link
          href="/c/anjha1"
          className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-2xs"
        >
          View Creator Storefront →
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            Indexing platform-verified creator profiles on Adzunova. First-party OAuth authenticated metrics only.
          </div>
          <div className="text-xs font-semibold text-foreground">
            Active Verified Roster: <span className="text-primary font-bold">{verifiedCount}</span>
          </div>
        </div>

        <BrandEmptyState
          title="Talent Discovery Index"
          description="Creator discovery filters, multi-platform search, and rate card indexing are ready. Browse verified creator profiles directly."
          iconName="Compass"
          actionLabel="Open Verified Creator Profile"
          actionHref="/c/anjha1"
        />
      </div>
    </BrandPageContainer>
  );
}
