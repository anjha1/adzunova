import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Logo } from '@/components/brand/Logo';

export default async function BrandForbiddenPage() {
  const session = await getSession();
  const currentRole = session?.user?.role;
  const currentEmail = session?.user?.email;

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
            {currentEmail && (
              <>
                {' '}You are currently signed in as{' '}
                <span className="font-mono text-foreground font-semibold">
                  {currentEmail}
                </span>{' '}
                ({currentRole || 'User'}).
              </>
            )}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          {currentRole === 'CREATOR' && (
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
