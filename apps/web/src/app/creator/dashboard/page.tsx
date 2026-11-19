import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { getSocialAccountsByCreatorId } from '@/lib/social/social-repository';
import { getLatestAudienceSnapshot } from '@/lib/social/metrics-store';

export default async function CreatorDashboardPage() {
  const session = await getSession();
  const profile = session?.profile;
  const user = session?.user;
  const creatorId = user?.id;

  // Real data from DB
  const socialAccounts = creatorId ? await getSocialAccountsByCreatorId(creatorId) : [];
  const primaryAccount = socialAccounts.find((a) => a.provider === 'instagram' && a.status === 'ACTIVE') || socialAccounts[0];
  const audienceSnapshot = primaryAccount ? await getLatestAudienceSnapshot(primaryAccount.id) : null;

  // Real computed totals
  const totalFollowers = socialAccounts.reduce((sum, a) => sum + Number(a.followers_count || 0), 0);
  const totalEarnings = 0;
  const pendingEscrow = 0;
  const activeCampaigns = 0;

  // Audience score computed strictly from real snapshot
  const audienceScore = audienceSnapshot && audienceSnapshot.totalAudienceSampled > 0
    ? Math.round(audienceSnapshot.share_18_plus * 80 + audienceSnapshot.gender_known_share * 20)
    : null;

  // Real action items generated from platform states
  const actionItems: { id: string; title: string; brandName: string; type: 'warning' | 'info'; href: string }[] = [];
  for (const acc of socialAccounts) {
    if (acc.status === 'RECONNECT_REQUIRED') {
      actionItems.push({
        id: `reconnect_${acc.id}`,
        title: `Instagram token expired: Reconnect @${acc.username} to restore live analytics sync`,
        brandName: 'System Notice',
        type: 'warning',
        href: '/creator/accounts',
      });
    }
  }

  const displayName = user?.displayName || profile?.displayName || user?.email?.split('@')[0] || 'Creator';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 desk:p-8 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/60 backdrop-blur-md text-xs font-semibold mb-3 border border-indigo-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Adzunova Creator Command Center</span>
          </div>
          <h1 className="text-2xl desk:text-4xl font-black tracking-tight">
            Welcome, {displayName}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm desk:text-base leading-relaxed">
            Your centralized creator hub. Build and publish your rate card to begin receiving direct brand sponsorships.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/creator/rate-card"
              className="px-4 py-2.5 rounded-xl bg-card text-foreground hover:bg-muted font-bold text-xs desk:text-sm shadow-md transition"
            >
              Set Up Rate Card
            </Link>
            <Link
              href="/creator/accounts"
              className="px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700/80 border border-indigo-400/30 text-white font-bold text-xs desk:text-sm backdrop-blur-md transition"
            >
              Connect Social Accounts
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* Action Center - Real State Only */}
      <div className="bg-muted/40 border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <ShellIcon name="Flame" size={18} className="text-indigo-600 dark:text-indigo-400" />
            <span>Action Center • {actionItems.length} items requiring attention</span>
          </div>
        </div>

        {actionItems.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-card border border-border">
            <p className="text-sm font-semibold text-foreground">
              All caught up! No urgent actions required.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              When brands send deal offers or revision requests, they will appear here with active SLA timers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 desk:grid-cols-2 gap-3">
            {actionItems.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs desk:text-sm text-foreground">
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
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Earnings
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <ShellIcon name="TrendingUp" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-foreground mt-3">
            ₹{totalEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            0 completed sponsorships
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Clearances
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <ShellIcon name="Clock" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-foreground mt-3">
            ₹{pendingEscrow.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            No active contracts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Campaigns
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <ShellIcon name="Briefcase" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-foreground mt-3">
            {activeCampaigns}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Publish rate card to receive deals
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Audience Score
            </span>
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <ShellIcon name="Sparkles" size={16} />
            </div>
          </div>
          <div className="text-2xl desk:text-3xl font-black text-foreground mt-3">
            {audienceScore !== null ? `${audienceScore}/100` : '—'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {audienceScore !== null ? 'Verified organic audience' : 'Pending social account sync'}
          </div>
        </div>
      </div>

      {/* Social Accounts & Live Setup CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Connected Social Accounts
              </h2>
              <p className="text-xs text-muted-foreground">
                {socialAccounts.length > 0
                  ? `Total Verified Reach: ${totalFollowers.toLocaleString()} followers`
                  : 'Official OAuth API status & verified follower metrics'}
              </p>
            </div>
            <Link
              href="/creator/accounts"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Manage Accounts →
            </Link>
          </div>

          {socialAccounts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-muted/20">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                ✦
              </div>
              <h3 className="font-bold text-sm text-foreground">
                No Social Accounts Connected Yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                Connect your YouTube, Instagram, or TikTok account to enable automatic follower and engagement rate verification.
              </p>
              <Link
                href="/creator/accounts"
                className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
              >
                Connect Instagram / YouTube
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {socialAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs">
                      IG
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">@{acc.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {acc.status === 'ACTIVE'
                          ? `Verified & Active • ${acc.sync_tier} tier`
                          : `Status: ${acc.status}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-foreground">
                      {Number(acc.followers_count).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground">Followers</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rate Card Setup Guide Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-4">
              <ShellIcon name="Tag" size={14} />
              <span>Rate Card Setup</span>
            </div>

            <h3 className="font-bold text-foreground text-base">
              Set Your Sponsorship Pricing
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Define standard prices for your Reels, YouTube videos, and packages. Brands book you directly without manual back-and-forth pricing negotiations.
            </p>
          </div>

          <Link
            href="/creator/rate-card"
            className="w-full py-2.5 px-4 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition mt-6"
          >
            Configure Rate Card
          </Link>
        </div>
      </div>
    </div>
  );
}
