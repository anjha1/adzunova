import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              ADZUNOVA
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
              Brand Enterprise
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {profile?.companyName || user.email}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user.emailVerified ? 'Corporate Verified' : 'Pending Verification'}
              </div>
            </div>
            <form action="/api/auth/logout?redirect=/auth/brand/sign-in" method="POST">
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
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome, {profile?.contactName || 'Marketing Leader'}!
          </h1>
          <p className="mt-2 text-slate-300 max-w-2xl text-sm">
            Launch creator discovery campaigns, approve contracts, track deliverable milestones, and automate escrow.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Live Campaigns
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">0</div>
            <div className="text-xs text-slate-500 mt-1">Ready to create campaign brief</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Escrow Allocated
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">$0.00</div>
            <div className="text-xs text-slate-500 mt-1">Institutional custodial protection</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Contracted Creators
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">0</div>
            <div className="text-xs text-slate-500 mt-1">Search 25,000+ verified talent</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Company Status
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {profile?.onboardingCompleted ? 'Active' : 'Setup'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {profile?.industry || 'Enterprise'}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Creator Pipeline & In-Review Deliverables
            </h2>
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No active deliverables awaiting brand review.</p>
              <p className="text-xs mt-1 text-slate-400">
                When creators submit videos, UGC assets, or proof-of-posting, they appear here for your formal sign-off.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Management</h2>
            <div className="space-y-2">
              <Link
                href="/brand/onboarding"
                className="block w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition"
              >
                Update Enterprise Profile
              </Link>
              <Link
                href="/for-brands"
                className="block w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Read Brand Playbook
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
