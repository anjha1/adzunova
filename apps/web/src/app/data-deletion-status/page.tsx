import React, { Suspense } from 'react';
import Link from 'next/link';
import { getDataDeletionStatus } from '@/lib/social/social-repository';

async function DataDeletionStatusContent({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const statusRecord = code ? await getDataDeletionStatus(code) : null;

  return (
    <>
      {code ? (
        statusRecord ? (
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">Confirmation Code</span>
              <span className="text-xs font-mono font-bold text-foreground">{statusRecord.confirmation_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">Platform</span>
              <span className="text-xs font-bold text-foreground capitalize">{statusRecord.provider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">Deletion Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
                {statusRecord.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">Completed At</span>
              <span className="text-xs text-foreground">
                {statusRecord.completed_at ? new Date(statusRecord.completed_at).toUTCString() : '—'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold">
            Confirmation code <span className="font-mono">{code}</span> was not found in our records. Please verify the code and try again.
          </div>
        )
      ) : (
        <div className="p-5 rounded-2xl bg-muted/40 border border-border text-sm text-muted-foreground">
          Please provide a valid confirmation code via the URL (e.g. <span className="font-mono text-foreground">?code=del_...</span>) to verify deletion status.
        </div>
      )}
    </>
  );
}

function DataDeletionSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-muted/20 border border-border animate-pulse space-y-3">
      <div className="h-4 w-48 bg-muted rounded" />
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="h-4 w-24 bg-muted rounded" />
    </div>
  );
}

export default function DataDeletionStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 desk:p-12">
      <div className="max-w-2xl mx-auto w-full pt-12 space-y-6">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl tracking-tight text-indigo-600 dark:text-indigo-400">
            ADZUNOVA
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            Privacy & Compliance
          </span>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
          <div>
            <h1 className="text-2xl font-black text-foreground">User Data Deletion Status</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              In accordance with Meta Platform Terms and data privacy regulations, this page provides real-time verification of data deletion requests.
            </p>
          </div>

          <Suspense fallback={<DataDeletionSkeleton />}>
            <DataDeletionStatusContent searchParams={searchParams} />
          </Suspense>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← Back to Adzunova Home
            </Link>
            <span className="text-[11px] text-muted-foreground">
              GDPR & Meta Platform Compliant
            </span>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-muted-foreground py-6">
        © 2026 Adzunova Marketplace. All rights reserved.
      </footer>
    </div>
  );
}
