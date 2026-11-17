import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const instant = false;

export default async function CreatorDashboardPage() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/api/auth/logout?redirect=/auth/creator/sign-in');
  }

  if (session.user.role !== 'CREATOR') {
    redirect('/brand/dashboard');
  }

  const { user, profile } = session;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
              ADZUNOVA
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Creator Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {profile?.displayName || user.email}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user.emailVerified ? 'Verified Creator' : 'Verification Pending'}
              </div>
            </div>
            <form action="/api/auth/logout?redirect=/auth/creator/sign-in" method="POST">
              <button
                type="submit"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome back, {profile?.displayName || 'Creator'}!
          </h1>
          <p className="mt-2 text-indigo-100 max-w-2xl text-sm">
            Manage your sponsorships, active brand contracts, milestones, and secure escrow payouts.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Active Campaigns
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">0</div>
            <div className="text-xs text-slate-500 mt-1">Ready for brand matchmaking</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Escrow Pending
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">$0.00</div>
            <div className="text-xs text-slate-500 mt-1">Zero-risk settlement enabled</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Profile Completeness
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              {profile?.onboardingCompleted ? '100%' : '50%'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {profile?.onboardingCompleted ? 'Publicly Listed' : 'Setup Required'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Total Invoiced
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">$0.00</div>
            <div className="text-xs text-slate-500 mt-1">Double-entry ledger verified</div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Active Sponsorship Offers
            </h2>
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No active sponsorship offers at this moment.</p>
              <p className="text-xs mt-1 text-slate-400">
                Brands browsing Adzunova&apos;s creator directory will send collaboration proposals directly to your dashboard.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/creator/onboarding"
                className="block w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
              >
                Edit Creator Profile
              </Link>
              <Link
                href="/for-creators"
                className="block w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                View Creator Guide
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
