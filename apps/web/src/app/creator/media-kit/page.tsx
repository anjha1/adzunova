'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { DerivedAudienceMetrics } from '@/lib/social/demographics-engine';

interface MediaKitData {
  hasConnectedAccount: boolean;
  account?: {
    id: string;
    username: string;
    provider: string;
    followersCount: number;
    mediaCount: number;
    status: string;
    lastSyncedAt: string | null;
  };
  totalReach: number;
  totalViews: number;
  audienceScore: number | null;
  audienceScoreDisplay?: string;
  isScoreComplete?: boolean;
  verificationLabel?: string;
  demographics: DerivedAudienceMetrics | null;
  enrichedDemographics?: {
    countries?: Array<{ countryCode: string; countryName: string; percentage: number; count: number }>;
  } | null;
}

export default function MediaKitPage() {
  const [data, setData] = useState<MediaKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadMediaKit() {
      try {
        const res = await fetch('/api/creator/analytics?range=30d');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.warn('Failed to load media kit data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMediaKit();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="h-96 bg-card border border-border rounded-3xl" />
      </div>
    );
  }

  const hasConnected = data?.hasConnectedAccount;
  const demographics = data?.demographics;
  const account = data?.account;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Automated Media Kit"
        description="Shareable live media kit backed by verified platform data. Direct brand partners to your verified profile."
        action={
          hasConnected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <ShellIcon name="Share2" size={14} />
                {copied ? 'Copied Public Link!' : 'Share Live Media Kit'}
              </button>
            </div>
          ) : undefined
        }
      />

      {!hasConnected ? (
        <EmptyState
          icon={<ShellIcon name="Share2" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="Media Kit Awaiting Connected Channels"
          description="Your public media kit is generated automatically from verified follower counts, video views, and audience demographics once you connect your Instagram or YouTube account."
          actionText="Connect Social Accounts"
          actionHref="/creator/accounts"
        />
      ) : (
        <div className="max-w-4xl mx-auto rounded-3xl bg-card border border-border shadow-xs overflow-hidden p-6 desk:p-8 space-y-8">
          {/* Header Card */}
          <div className="flex flex-col desk:flex-row desk:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-md">
                IG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-foreground">@{account?.username}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    Verified Creator
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.verificationLabel || (account?.lastSyncedAt
                    ? `Verified via Instagram API on ${new Date(account.lastSyncedAt).toLocaleDateString()}`
                    : 'Verified via Instagram API')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/creator/rate-card"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
              >
                View Rate Card
              </Link>
            </div>
          </div>

          {/* Key Verified Stats Strip */}
          <div className="grid grid-cols-2 desk:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border">
              <span className="text-xs text-muted-foreground font-semibold">Total Verified Reach</span>
              <div className="text-2xl font-black text-foreground mt-1">
                {Number(account?.followersCount || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-muted-foreground">Followers</span>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border">
              <span className="text-xs text-muted-foreground font-semibold">Published Content</span>
              <div className="text-2xl font-black text-foreground mt-1">
                {Number(account?.mediaCount || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-muted-foreground">Reels &amp; Posts</span>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border">
              <span className="text-xs text-muted-foreground font-semibold">18+ Audience Ratio</span>
              <div className="text-2xl font-black text-foreground mt-1">
                {demographics ? `${Math.round(demographics.share_18_plus * 100)}%` : '—'}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {demographics ? `Minor (13-17): ${Math.round(demographics.share_13_17 * 100)}%` : 'Pending sync'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border">
              <span className="text-xs text-muted-foreground font-semibold">Audience Quality</span>
              <div className="text-2xl font-black text-foreground mt-1">
                {data?.audienceScoreDisplay || (data?.isScoreComplete && data?.audienceScore ? `${data.audienceScore}/100` : 'Not enough data')}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {data?.isScoreComplete ? 'Verified organic audience' : 'Minimum history required'}
              </span>
            </div>
          </div>

          {/* Demographic Breakdown */}
          {demographics && (
            <div className="grid grid-cols-1 desk:grid-cols-2 gap-6 pt-2">
              {/* Age */}
              <div className="p-5 rounded-2xl bg-muted/20 border border-border space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Audience Age Segments
                </h3>
                <div className="space-y-2">
                  {demographics.ageDistribution.map((item) => (
                    <div key={item.bucket} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {item.bucket === '13-17' ? '13–17 (Meta estimate)' : item.bucket}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(item.percentage * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                          style={{ width: `${Math.round(item.percentage * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geography */}
              <div className="p-5 rounded-2xl bg-muted/20 border border-border space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Top Audience Geography
                </h3>
                <p className="text-[11px] text-muted-foreground">Share of followers with a known country, Meta estimate</p>
                {demographics.hasCountryBreakdown && (data?.enrichedDemographics?.countries?.length || demographics.countryDistribution.length > 0) ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {(data?.enrichedDemographics?.countries || demographics.countryDistribution).slice(0, 6).map((c: any) => (
                      <div key={c.countryCode} className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground truncate" title={c.countryName || c.countryCode}>
                          {c.countryName ? `${c.countryName} (${c.countryCode})` : c.countryCode}
                        </span>
                        <span className="text-muted-foreground ml-2">{Math.round(c.percentage * 100)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground pt-4">
                    Country geography breakdown is not exposed by current account settings.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer Transparency Notice */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Data audited and encrypted under Meta Platform Terms</span>
            <span>Adzunova Marketplace Live Kit</span>
          </div>
        </div>
      )}
    </div>
  );
}
