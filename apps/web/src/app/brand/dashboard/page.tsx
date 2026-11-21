import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Logo } from '@/components/brand/Logo';
import { getActiveVerifiedCreatorCount } from '@/lib/social/social-repository';
import { computeBrandVerificationBadge } from '@/lib/statutory/business-verification';

export const instant = false;

export default async function BrandDashboardPage() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/api/auth/logout?redirect=/auth/brand/sign-in');
  }

  if (session.user.role !== 'BRAND') {
    redirect('/creator/dashboard');
  }

  const { user, profile } = session;
  const verifiedCreatorCount = await getActiveVerifiedCreatorCount();
  const currency = profile?.currency || 'INR';
  const formattedBudget = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(0);

  // Combined Verification Badge: requires BOTH domain proof and business KYC
  const badgeInfo = computeBrandVerificationBadge({
    domainVerified: Boolean(profile?.domainVerified),
    businessVerificationStatus: (profile?.verificationStatus as any) || 'PENDING',
    businessVerifiedAt: profile?.verifiedAt,
  });

  // Plan badge only shown if backed by a real subscription record; default: none shown
  const planBadge = profile?.subscriptionPlan ? String(profile.subscriptionPlan).toUpperCase() : undefined;

  return (
    <div className="space-y-8">
      {/* Work Email Policy Restriction Banner (Phase B4) */}
        {user.status === 'RESTRICTED_WORK_EMAIL_REQUIRED' && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-foreground space-y-4 shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-lg">
                ⚠
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">
                  Workspace Restricted: Company Work Email Required
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To protect brand safety and corporate data, Brand workspaces cannot operate on personal or free email providers (<span className="font-mono text-foreground font-semibold">{user.email}</span>). Your account is in read-only restricted mode. To launch campaigns, book talent, and collaborate with creators, please verify an official company work email.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/brand/onboarding"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-2xs"
              >
                Verify Company Work Email →
              </Link>
              <Link
                href="/api/creator/privacy/export"
                className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition"
              >
                Export Workspace Data (DPDP)
              </Link>
            </div>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Welcome, {profile?.contactName || user.displayName || 'Brand Workspace'}!
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Launch creator discovery campaigns, manage proposals, track deliverables, and coordinate campaign execution.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-card p-5 rounded-2xl border border-border shadow-2xs">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Live Campaigns
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">0</div>
            <div className="text-xs text-muted-foreground mt-1">Ready to create campaign brief</div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border shadow-2xs">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Allocated Budget
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {formattedBudget}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Campaign budget committed</div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border shadow-2xs">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Contracted Creators
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">0</div>
            <div className="text-xs text-muted-foreground mt-1">
              Creators on Adzunova with verified data: {verifiedCreatorCount}
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border shadow-2xs">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Verification State
            </div>
            <div className="text-xl font-bold text-foreground mt-2 truncate">
              {badgeInfo.label}
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {badgeInfo.subtext}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Creator Pipeline & In-Review Deliverables
            </h2>
            <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
              <p className="text-sm font-medium">No active deliverables awaiting brand review.</p>
              <p className="text-xs mt-1 text-muted-foreground/80">
                When creators submit content or proof-of-posting, they appear here for your formal sign-off.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-foreground">Management</h2>
            <div className="space-y-2">
              <Link
                href="/brand/onboarding"
                className="block w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition shadow-2xs"
              >
                Company Profile & Setup
              </Link>
              <Link
                href="/brand/discover"
                className="block w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold border border-border text-foreground bg-muted/40 hover:bg-muted transition"
              >
                Discover Creators
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
