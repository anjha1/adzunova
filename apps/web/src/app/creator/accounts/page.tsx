'use client';

import React, { useState } from 'react';
import { PageHeader, EmptyState, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface SocialAccountItem {
  id: string;
  provider: 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK' | 'X';
  handle: string;
  followersCount: number;
  avgViews: number;
  isVerified: boolean;
  lastSyncedAt: string;
}

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccountItem[]>([]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Connected Social Accounts"
        description="Connect your official social media channels via OAuth. Adzunova automatically syncs and verifies follower metrics, engagement rate, and audience authenticity."
      />

      {/* Account Verification Summary */}
      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Connected Platforms"
          value={accounts.length}
          subValue="OAuth verified"
          icon={<ShellIcon name="Link2" size={16} />}
        />
        <StatCard
          label="Total Audience Reach"
          value={accounts.length === 0 ? '0' : '—'}
          subValue="Sum of verified followers"
          icon={<ShellIcon name="User" size={16} />}
        />
        <StatCard
          label="Audience Quality Score"
          value={accounts.length === 0 ? '—' : 'Pending sync'}
          subValue="Calculated from real API events"
          icon={<ShellIcon name="Sparkles" size={16} />}
        />
      </div>

      {/* Social Provider Cards Grid */}
      <div className="grid grid-cols-1 desk:grid-cols-2 gap-4">
        {/* Google / YouTube */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                YT
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">YouTube</h3>
                <p className="text-xs text-slate-500">Sync channel subscribers & video views</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Not Connected
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500">Official Google OAuth</span>
            <a
              href="/api/auth/google?role=CREATOR&redirect=/creator/accounts"
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
            >
              Connect YouTube
            </a>
          </div>
        </div>

        {/* Meta / Instagram */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center font-bold">
                IG
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instagram</h3>
                <p className="text-xs text-slate-500">Verify followers, Reels reach & engagement</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
              App Review Pending
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Instagram Graph API</span>
            <button
              disabled
              title="Meta App Review pending for production credentials"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Connect Instagram
            </button>
          </div>
        </div>

        {/* TikTok */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                TT
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">TikTok</h3>
                <p className="text-xs text-slate-500">Sync TikTok Creator profile metrics</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Not Configured
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">TikTok Developer API</span>
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Connect TikTok
            </button>
          </div>
        </div>

        {/* X / Twitter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                X
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">X (Twitter)</h3>
                <p className="text-xs text-slate-500">Verify follower base and post impressions</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Not Configured
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">X API v2</span>
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Connect X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
