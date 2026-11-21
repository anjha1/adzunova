import React from 'react';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';
import { getSession } from '@/lib/auth';

export default async function BrandTeamPage() {
  const session = await getSession();
  const userEmail = session?.user?.email;

  return (
    <BrandPageContainer
      title="Team & Roles"
      category="WORKSPACE"
      description="Manage enterprise team members, RBAC permissions and approval hierarchies"
      iconName="Users"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Workspace Owner
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {(userEmail?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{userEmail}</div>
                <div className="text-xs text-muted-foreground">Owner · Full Admin & Approval Authority</div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
              Active
            </span>
          </div>
        </div>

        <BrandEmptyState
          title="Invite Teammates"
          description="Collaborate with marketing managers, legal reviewers, and finance controllers with granular role-based access control."
          iconName="Users"
        />
      </div>
    </BrandPageContainer>
  );
}
