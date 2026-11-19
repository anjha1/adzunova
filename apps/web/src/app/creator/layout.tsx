import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CreatorShell } from '@/components/creator/shell/creator-shell';

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/api/auth/logout?redirect=/auth/creator/sign-in');
  }

  if (session.user.role !== 'CREATOR') {
    redirect('/brand/dashboard');
  }

  const { user, profile } = session;

  return (
    <CreatorShell
      userEmail={user.email}
      displayName={user.displayName || profile?.displayName}
      avatarUrl={user.avatarUrl || profile?.avatarUrl}
      isVerified={user.emailVerified}
    >
      {children}
    </CreatorShell>
  );
}
