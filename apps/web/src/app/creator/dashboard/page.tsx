import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export const instant = false;

export default async function CreatorDashboardPage() {
  const session = await getSession();
  const profile = session?.profile;
  const user = session?.user;

  // Real data defaults: exactly zeros/empty if not present in DB
  const totalEarnings = 0;
  const pendingEscrow = 0;
  const activeCampaigns = 0;
  const audienceScore = 0;
  const actionItems: any[] = [];
  const socialAccounts: any[] = [];

  const displayName = user?.displayName || profile?.displayName || user?.email?.split('@')[0] || 'Creator';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 desk:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Adzunova Creator Command Center</span>
          </div>
          <h1 className="text-2xl desk:text-4xl font-black tracking-tight">
            Welcome, {displayName}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm desk:text-base leading-relaxed">
            Your centralized creator hub. Build and publish your verified rate card to begin receiving direct brand sponsorships with guaranteed escrow payments.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/creator/rate-card"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs desk:text-sm shadow-md transition"
            >
              Set Up Rate Card
            </Link>
            <Link
              href="/creator/accounts"
              className="px-4 py-2.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/20 text-white font-bold text-xs desk:text-sm backdrop-blur-md transition"
            >
              Connect Social Accounts
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Action Center ("Needs Your Attention") - Real State Only */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ShellIcon name="Flame" size={18} className="text-indigo-600 dark:text-indigo-400" />
            <span>Action Center • {actionItems.length} items requiring attention</span>
          </div>
        </div>

        {actionItems.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              All caught up! No urgent actions required.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              When brands send deal offers or revision requests, they will appear here with active SLA timers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 desk:grid-cols-2 gap-3">
            {actionItems.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs desk:text-sm text-slate-900 dark:text-white">
                    {act.brandName} • {act.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Financial & Growth Strip - Honest Zeros */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 desk:gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Earnings
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ShellIcon name="TrendingUp" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-slate-900 dark:text-white mt-3">
            ₹{totalEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            0 completed sponsorships
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Escrow
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ShellIcon name="ShieldCheck" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-slate-900 dark:text-white mt-3">
            ₹{pendingEscrow.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            No active escrow contracts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Campaigns
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ShellIcon name="Briefcase" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {activeCampaigns}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Publish rate card to receive deals
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Audience Score
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ShellIcon name="Sparkles" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {audienceScore > 0 ? `${audienceScore}/100` : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Pending social account sync
          </div>
        </div>
      </div>

      {/* Social Accounts & Live Setup CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Connected Social Accounts
              </h2>
              <p className="text-xs text-slate-500">Official OAuth API status & verified follower metrics</p>
            </div>
            <Link
              href="/creator/accounts"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Connect Accounts →
            </Link>
          </div>

          {socialAccounts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                ✦
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                No Social Accounts Connected Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Connect your YouTube, Instagram, or TikTok account to enable automatic follower and engagement rate verification.
              </p>
              <Link
                href="/creator/accounts"
                className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
              >
                Connect Instagram / YouTube
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Live list renders here */}
            </div>
          )}
        </div>

        {/* Rate Card Setup Guide Card */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-4">
              <ShellIcon name="Tag" size={14} />
              <span>Rate Card Setup</span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Set Your Sponsorship Pricing
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Define standard prices for your Reels, YouTube videos, and packages. Brands book you directly through escrow without manual back-and-forth pricing negotiations.
            </p>
          </div>

          <Link
            href="/creator/rate-card"
            className="w-full py-2.5 px-4 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition mt-6"
          >
            Configure Rate Card
          </Link>
        </div>
      </div>
    </div>
  );
}
