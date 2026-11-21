import React, { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { BrandShell } from '@/components/brand/shell/brand-shell';
import { Logo } from '@/components/brand/Logo';
import { BrandUserRole } from '@/components/brand/shell/brand-nav-config';
import { computeBrandVerificationBadge } from '@/lib/statutory/business-verification';

function BrandContentSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col desk:flex-row text-foreground">
      <div className="hidden desk:block w-64 border-r border-border bg-card p-4 space-y-4">
        <div className="h-8 w-32 bg-muted rounded-xl animate-pulse" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-9 w-full bg-muted/60 rounded-xl animate-pulse" />
          <div className="h-9 w-full bg-muted/60 rounded-xl animate-pulse" />
          <div className="h-9 w-full bg-muted/60 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
          <div className="h-28 bg-card border border-border rounded-2xl" />
          <div className="h-28 bg-card border border-border rounded-2xl" />
          <div className="h-28 bg-card border border-border rounded-2xl" />
          <div className="h-28 bg-card border border-border rounded-2xl" />
        </div>
        <div className="h-72 bg-card border border-border rounded-3xl" />
      </div>
    </div>
  );
}

function BrandForbiddenView({
  email,
  role,
}: {
  email?: string;
  role?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-center">
          <Logo variant="full" size="md" href="/" />
        </div>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center text-2xl font-bold">
          403
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            Access Restricted: Brand Account Required
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The requested workspace is restricted to verified enterprise and brand accounts.
            {email && (
              <>
                {' '}You are currently signed in as{' '}
                <span className="font-mono text-foreground font-semibold">
                  {email}
                </span>{' '}
                ({role || 'User'}).
              </>
            )}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          {role === 'CREATOR' && (
            <Link
              href="/creator/dashboard"
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-2xs"
            >
              Return to Creator Dashboard →
            </Link>
          )}

          <form action="/api/auth/logout?redirect=/auth/brand/sign-in" method="POST">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition cursor-pointer"
            >
              Sign in with Brand Work Email
            </button>
          </form>

          <Link
            href="/"
            className="inline-block text-xs text-muted-foreground hover:text-foreground transition pt-2"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

async function BrandAuthGuard({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Fails closed: unauthenticated users redirected to brand login
  if (!session || !session.user) {
    redirect('/api/auth/logout?redirect=/auth/brand/sign-in');
  }

  const { user, profile } = session;

  // Server-side Role Check: reject non-BRAND roles with 403 Forbidden page, never a blank shell
  if (user.role !== 'BRAND' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return <BrandForbiddenView email={user.email} role={user.role} />;
  }

  // Combined Verification Badge: requires BOTH domain proof and business KYC
  const badgeInfo = computeBrandVerificationBadge({
    domainVerified: Boolean(profile?.domainVerified),
    businessVerificationStatus: (profile?.verificationStatus as any) || 'PENDING',
    businessVerifiedAt: profile?.verifiedAt,
  });

  const planBadge = profile?.subscriptionPlan ? String(profile.subscriptionPlan).toUpperCase() : undefined;
  const isAgency = profile?.businessType === 'AGENCY';
  const role: BrandUserRole = 'OWNER';

  return (
    <BrandShell
      userEmail={user.email}
      companyName={profile?.companyName}
      contactName={profile?.contactName}
      role={role}
      verificationLabel={badgeInfo.label}
      planBadge={planBadge}
      isAgency={isAgency}
      unreadCount={0}
      approvalsCount={0}
    >
      {children}
    </BrandShell>
  );
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<BrandContentSkeleton />}>
      <BrandAuthGuard>{children}</BrandAuthGuard>
    </Suspense>
  );
}
