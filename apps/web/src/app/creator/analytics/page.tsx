'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader, StatCard, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { DerivedAudienceMetrics } from '@/lib/social/demographics-engine';

interface AnalyticsData {
  hasConnectedAccount: boolean;
  account?: {
    id: string;
    username: string;
    provider: string;
    followersCount: number;
    mediaCount: number;
    status: string;
    lastSyncedAt: string | null;
    syncTier: string;
  };
  totalReach: number;
  totalViews: number;
  totalViews24h?: number | null;
  audienceScore: number | null;
  audienceScoreDisplay?: string;
  isScoreComplete?: boolean;
  verificationLabel?: string;
  qualityEvaluation: {
    score: number | null;
    status: 'COMPLETE' | 'PARTIAL' | 'NOT_AVAILABLE';
    missingFactors: string[];
    factors: { name: string; score: number | null; weight: number; description: string }[];
  };
  followersSeries: { timestamp: string; value: number }[];
  viewsSeries: { timestamp: string; value: number }[];
  demographics: DerivedAudienceMetrics | null;
  enrichedDemographics?: {
    countries?: Array<{ countryCode: string; countryName: string; percentage: number; count: number }>;
    genderUnknownShare?: number;
  } | null;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch('/api/creator/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.warn('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card border border-border rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const hasConnected = data?.hasConnectedAccount;
  const demographics = data?.demographics;
  const quality = data?.qualityEvaluation;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Verified Audience Analytics"
        description="First-party verified metrics ingested via Meta Graph API OAuth. Never self-reported."
        action={
          hasConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground shadow-xs">
                Period: Last 24h (Meta API)
              </span>
            </div>
          ) : undefined
        }
      />

      {/* Sync Status Banner */}
      {hasConnected && data?.account && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-foreground">@{data.account.username}</span>
            <span className="text-muted-foreground">
              &bull; Official Instagram Graph API ({data.account.syncTier} tier)
            </span>
          </div>
          <div className="text-muted-foreground">
            {data.account.lastSyncedAt ? (
              <span>Last synced: {new Date(data.account.lastSyncedAt).toLocaleString()}</span>
            ) : (
              <span>Initial sync in progress</span>
            )}
          </div>
        </div>
      )}

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Total Verified Reach"
          value={hasConnected ? data?.totalReach.toLocaleString() : '—'}
          subValue={hasConnected ? 'Live Instagram followers' : 'Connect account to verify'}
          icon={<ShellIcon name="Users" size={16} />}
        />
        <StatCard
          label="24h View Impressions"
          value={hasConnected && data?.totalViews !== undefined && data?.totalViews !== null ? data.totalViews.toLocaleString() : '—'}
          subValue={hasConnected ? 'Last 24h (Meta API)' : 'Awaiting data sync'}
          icon={<ShellIcon name="Eye" size={16} />}
        />
        <StatCard
          label="18+ Audience Share"
          value={demographics ? `${Math.round(demographics.share_18_plus * 100)}%` : '—'}
          subValue={
            demographics
              ? `Minor share (13–17): ${Math.round(demographics.share_13_17 * 100)}%`
              : 'Requires demographics sync'
          }
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
        <StatCard
          label="Audience Quality Score"
          value={data?.audienceScoreDisplay || 'Not enough data'}
          subValue={
            quality?.status === 'COMPLETE'
              ? 'Verified organic audience'
              : 'Minimum history required'
          }
          icon={<ShellIcon name="Sparkles" size={16} />}
        />
      </div>

      {!hasConnected ? (
        <EmptyState
          icon={<ShellIcon name="BarChart2" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Verified Analytics Available Yet"
          description="Connect your Instagram Professional account to ingest verified audience demographics, views, and reach statistics."
          actionText="Connect Social Accounts"
          actionHref="/creator/accounts"
        />
      ) : (
        <div className="space-y-6">
          {/* Quality Score Breakdown (Honest about partial state) */}
          {quality && quality.status === 'PARTIAL' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 mb-1">
                <ShellIcon name="AlertCircle" size={14} />
                <span>Audience Quality Score is Pending Minimum History</span>
              </div>
              <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                Adzunova requires a full demographics snapshot, 24h view impressions, and at least 3 historical progression points before publishing a score. Pending: {quality.missingFactors.join(', ')}.
              </p>
            </div>
          )}

          {/* Demographic Breakdown: Age Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Follower Age Distribution</h3>
                  <p className="text-xs text-muted-foreground">All 7 standard Meta demographic brackets</p>
                </div>
                {demographics?.dominant_age_bucket && (
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    Primary: {demographics.dominant_age_bucket}
                  </span>
                )}
              </div>

              {demographics?.ageDistribution ? (
                <div className="space-y-3 pt-2">
                  {demographics.ageDistribution.map((item) => (
                    <div key={item.bucket} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {item.bucket === '13-17' ? '13–17 (Meta estimate)' : item.bucket}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(item.percentage * 100)}% ({item.count.toLocaleString()})
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round(item.percentage * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Demographic age data pending weekly sync window.
                </div>
              )}
            </div>

            {/* Gender Distribution */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Follower Gender Distribution</h3>
                  <p className="text-xs text-muted-foreground">Self-reported and modeled by Meta</p>
                </div>
              </div>

              {demographics?.genderDistribution ? (
                <div className="space-y-4 pt-2">
                  {demographics.genderDistribution.map((item) => (
                    <div key={item.gender} className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.gender === 'U' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                              Meta estimate
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-foreground">
                          {Math.round(item.percentage * 100)}% ({item.count.toLocaleString()})
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.gender === 'F'
                              ? 'bg-emerald-500'
                              : item.gender === 'M'
                              ? 'bg-indigo-600 dark:bg-indigo-400'
                              : 'bg-muted-foreground/40'
                          }`}
                          style={{ width: `${Math.round(item.percentage * 100)}%` }}
                        />
                      </div>
                      {item.note && (
                        <p className="text-[11px] text-muted-foreground pt-1">{item.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Demographic gender data pending weekly sync window.
                </div>
              )}
            </div>
          </div>

          {/* Geographic Breakdown: Country */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-sm text-foreground">Top Audience Geography</h3>
                <p className="text-xs text-muted-foreground">Share of followers with a known country, Meta estimate</p>
              </div>
            </div>

            {demographics?.hasCountryBreakdown && (data?.enrichedDemographics?.countries?.length || demographics.countryDistribution.length > 0) ? (
              <div className="grid grid-cols-2 desk:grid-cols-5 gap-3 pt-2">
                {(data?.enrichedDemographics?.countries || demographics.countryDistribution).map((c: any) => (
                  <div key={c.countryCode} className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
                    <div className="font-bold text-sm text-foreground truncate" title={c.countryName || c.countryCode}>
                      {c.countryName ? `${c.countryName} (${c.countryCode})` : c.countryCode}
                    </div>
                    <div className="text-xs font-semibold text-primary mt-1">
                      {Math.round(c.percentage * 100)}%
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {c.count.toLocaleString()} followers
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-muted/20 border border-dashed border-border text-center text-xs text-muted-foreground">
                Country demographics breakdown is currently not exposed by this account&apos;s privacy settings.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
