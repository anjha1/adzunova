import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CreatorShell } from '@/components/creator/shell/creator-shell';

function CreatorContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-muted rounded-xl" />
      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <div className="h-28 bg-card border border-border rounded-2xl" />
        <div className="h-28 bg-card border border-border rounded-2xl" />
        <div className="h-28 bg-card border border-border rounded-2xl" />
        <div className="h-28 bg-card border border-border rounded-2xl" />
      </div>
      <div className="h-72 bg-card border border-border rounded-3xl" />
    </div>
  );
}

async function CreatorAuthGuard({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/api/auth/logout?redirect=/auth/creator/sign-in');
  }

  if (session.user.role !== 'CREATOR') {
    redirect('/brand/dashboard');
  }

  return <>{children}</>;
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreatorShell>
      <Suspense fallback={<CreatorContentSkeleton />}>
        <CreatorAuthGuard>{children}</CreatorAuthGuard>
      </Suspense>
    </CreatorShell>
  );
}
