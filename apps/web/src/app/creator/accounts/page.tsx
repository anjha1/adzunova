'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { SocialPlatformIcon } from '@/components/creator/ui/social-platform-icon';
import {
  getSocialErrorDetails,
  getYouTubeErrorDetails,
  SocialErrorDetails,
  YouTubeErrorDetails,
} from '@/lib/social/error-taxonomy';

interface SocialAccountItem {
  id: string;
  provider: 'instagram' | 'youtube';
  username: string;
  account_type: string;
  profile_picture_url: string | null;
  followers_count: number;
  media_count: number;
  status: 'ACTIVE' | 'RECONNECT_REQUIRED' | 'REVOKED' | 'SUSPENDED';
  scopes: string[];
  capabilities: {
    basic_profile?: boolean;
    views_insights?: boolean;
    demographics_gender_age?: boolean;
    demographics_country?: boolean;
    hiddenSubscriberCount?: boolean;
    totalChannelViews?: number;
    dataThroughDate?: string | null;
    analyticsDailySeries?: { available: boolean; reason?: string };
    viewerDemographics?: { available: boolean; reason?: string; basis?: string };
    errors?: Record<string, string>;
  };
  connected_at: string;
  last_synced_at: string | null;
  next_sync_at: string | null;
  sync_tier: string;
}

interface CapabilityState {
  configured: boolean;
  status: string;
  reason?: string;
}

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccountItem[]>([]);
  const [latestData, setLatestData] = useState<any>(null);
  const [selectedIgId, setSelectedIgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showYtDisconnectOptions, setShowYtDisconnectOptions] = useState(false);
  const [ytDeleteMetrics, setYtDeleteMetrics] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: SocialErrorDetails | YouTubeErrorDetails;
  } | null>(null);

  const [instagramCap, setInstagramCap] = useState<CapabilityState>({
    configured: false,
    status: 'NOT_CONFIGURED',
    reason: 'Checking configuration...',
  });
  const [youtubeCap, setYoutubeCap] = useState<CapabilityState>({
    configured: false,
    status: 'NOT_CONFIGURED',
    reason: 'Checking configuration...',
  });

  // Check URL params for OAuth return status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      const connected = params.get('connected');
      const error = params.get('error');
      const message = params.get('message');
      const username = params.get('username');

      if (connected === 'youtube') {
        setFeedback({
          type: 'success',
          message: 'Successfully connected YouTube channel via Google OAuth (read-only).',
        });
      } else if (success === 'instagram_connected') {
        setFeedback({
          type: 'success',
          message: username
            ? `Successfully connected Instagram professional account @${username}. Initial sync complete.`
            : 'Successfully connected Instagram account.',
        });
      } else if (success === 'multiple_accounts_connected') {
        const count = params.get('count') || 'multiple';
        setFeedback({
          type: 'success',
          message: `Successfully connected ${count} Instagram professional accounts (active: @${username || 'selected'}). Initial sync complete.`,
        });
      } else if (error) {
        const ytErrorCodes = [
          'missing_scope',
          'no_refresh_token',
          'no_channel',
          'google_api_error',
          'youtube_not_configured',
        ];
        if (ytErrorCodes.includes(error) || params.has('support_id') || params.has('missing')) {
          const details = getYouTubeErrorDetails(error, {
            reason: params.get('reason'),
            missing: params.get('missing'),
            supportId: params.get('support_id'),
          });
          setFeedback({
            type: 'error',
            message: details.message,
            details,
          });
        } else {
          const details = getSocialErrorDetails(error, {
            message: message ? decodeURIComponent(message) : undefined,
            incidentId: params.get('incident_id'),
            metaCode: params.get('meta_code'),
            metaSubcode: params.get('meta_subcode'),
          });
          setFeedback({
            type: 'error',
            message: details.message,
            details,
          });
        }
      }
    }
  }, []);

  // Fetch capabilities, connected accounts, and latest read model
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [capRes, accRes, latestRes] = await Promise.all([
          fetch('/api/capabilities'),
          fetch('/api/creator/social-accounts'),
          fetch('/api/creator/social-account-latest').catch(() => null),
        ]);

        if (capRes.ok) {
          const capData = await capRes.json();
          if (capData.social?.metaInstagram) {
            setInstagramCap(capData.social.metaInstagram);
          }
          if (capData.social?.googleYouTube) {
            setYoutubeCap(capData.social.googleYouTube);
          }
        }

        if (accRes.ok) {
          const accData = await accRes.json();
          setAccounts(accData.accounts || []);
        }

        if (latestRes && latestRes.ok) {
          const lData = await latestRes.json();
          setLatestData(lData);
        }
      } catch (err) {
        console.warn('Failed to load accounts data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const instagramAccounts = accounts.filter((a) => a.provider === 'instagram' && a.status === 'ACTIVE');
  const instagramAccount = (selectedIgId ? instagramAccounts.find((a) => a.id === selectedIgId) : null) || instagramAccounts[0];
  const youtubeAccount = accounts.find((a) => a.provider === 'youtube') || null;

  const totalFollowers = accounts.reduce((sum, acc) => {
    if (acc.provider === 'youtube' && acc.capabilities?.hiddenSubscriberCount) return sum;
    return sum + Number(acc.followers_count || 0);
  }, 0);

  async function handleDisconnect(provider: 'instagram' | 'youtube', deleteMetrics = false) {
    if (
      provider === 'instagram' &&
      !window.confirm(`Are you sure you want to disconnect ${provider}? Your verified follower count and analytics sync will be stopped.`)
    ) {
      return;
    }

    try {
      setDisconnecting(true);
      const res = await fetch(`/api/creator/social-accounts/${provider}/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteMetrics }),
      });

      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.provider !== provider));
        if (provider === 'instagram') setSelectedIgId(null);
        setShowYtDisconnectOptions(false);
        setFeedback({
          type: 'success',
          message: `Successfully disconnected ${provider}. Credentials and active sync revoked.`,
        });
      } else {
        const data = await res.json();
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to disconnect account',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network error while disconnecting account',
      });
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleSyncNow(provider: 'instagram' | 'youtube') {
    try {
      setSyncing(true);
      const res = await fetch('/api/creator/social-accounts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Synchronized ${provider} metrics successfully. Follower count: ${Number(
            data.newFollowersCount || 0
          ).toLocaleString()}.`,
        });
        const accRes = await fetch('/api/creator/social-accounts');
        if (accRes.ok) {
          const accData = await accRes.json();
          setAccounts(accData.accounts || []);
        }
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to sync account',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network error while triggering synchronization',
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Connected Social Accounts"
        description="Connect your official social media channels via OAuth. Adzunova automatically syncs and verifies follower metrics, engagement rate, and audience demographics."
      />

      {feedback && (
        <div
          data-testid="feedback-banner"
          role="alert"
          aria-live="assertive"
          className={`p-4 rounded-2xl border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 flex items-center justify-between text-xs font-semibold'
              : 'bg-destructive/10 text-destructive border-destructive/25 dark:bg-destructive/15 dark:border-destructive/30 space-y-3'
          }`}
        >
          {feedback.type === 'success' ? (
            <>
              <div className="flex items-center gap-2">
                <ShellIcon name="CheckCircle" size={16} />
                <span>{feedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="p-1 hover:opacity-75 transition font-bold text-xs"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 text-destructive">
                    <ShellIcon name="AlertCircle" size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-destructive">
                      {feedback.details?.title || 'Connection Alert'}
                    </h4>
                    <p className="text-xs leading-relaxed text-destructive/90 dark:text-destructive-foreground">
                      {feedback.message}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="p-1 text-destructive hover:opacity-75 transition font-bold text-xs"
                  aria-label="Dismiss alert"
                >
                  ✕
                </button>
              </div>

              {feedback.details && (
                <div className="pt-2 border-t border-destructive/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {('incidentId' in feedback.details && feedback.details.incidentId) ||
                  ('supportId' in feedback.details && feedback.details.supportId) ? (
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted/60 border border-border text-foreground">
                      ID: {'incidentId' in feedback.details && feedback.details.incidentId
                        ? feedback.details.incidentId
                        : 'supportId' in feedback.details
                        ? feedback.details.supportId
                        : ''}
                    </span>
                  ) : null}
                  {feedback.details.actionHref && (
                    <Link
                      href={feedback.details.actionHref}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 font-bold text-xs shadow-xs transition"
                    >
                      <span>{feedback.details.actionText}</span>
                      <ShellIcon name="ExternalLink" size={12} />
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Account Verification Summary */}
      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Connected Platforms"
          value={loading ? '—' : accounts.length}
          subValue={accounts.length > 0 ? 'OAuth verified' : 'No platforms connected'}
          icon={<ShellIcon name="Link2" size={16} />}
        />
        <StatCard
          label="Total audience (followers + subscribers)"
          value={loading ? '—' : totalFollowers.toLocaleString()}
          subValue="Per-platform breakdown below"
          icon={<ShellIcon name="User" size={16} />}
        />
        <StatCard
          label="Audience Quality Score"
          value={accounts.length === 0 ? '—' : (latestData?.audienceScoreDisplay || 'Not enough data')}
          subValue={latestData?.isScoreComplete ? 'Verified organic audience' : 'Calculated from real API events'}
          icon={<ShellIcon name="Sparkles" size={16} />}
        />
      </div>

      {/* Social Provider Cards Grid */}
      <div className="grid grid-cols-1 desk:grid-cols-2 gap-4">
        {/* Meta / Instagram */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  <SocialPlatformIcon platform="instagram" size={40} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Instagram</h3>
                  <p className="text-xs text-muted-foreground">Verify followers, views reach & demographics</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  instagramAccount
                    ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300 border border-emerald-500/20'
                    : instagramCap.configured
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {instagramAccount
                  ? 'Connected & Verified'
                  : instagramCap.configured
                  ? 'Ready to Connect'
                  : 'Not Configured'}
              </span>
            </div>

            {/* Multi-account Chooser */}
            {instagramAccounts.length > 1 && (
              <div className="mt-4 p-3 rounded-xl bg-muted/60 border border-border space-y-2">
                <div className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                  <span>Connected Profiles ({instagramAccounts.length})</span>
                  <span className="text-[10px] text-muted-foreground">Select to view</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {instagramAccounts.map((acc) => {
                    const isSelected = acc.id === instagramAccount?.id;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedIgId(acc.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'bg-background text-muted-foreground border border-border hover:text-foreground'
                        }`}
                      >
                        @{acc.username}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {instagramAccount ? (
              <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-foreground">@{instagramAccount.username}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Connected {new Date(instagramAccount.connected_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base text-foreground">
                      {instagramAccount.followers_count.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Followers</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Media Posts: </span>
                    <span className="font-semibold text-foreground">{instagramAccount.media_count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sync Tier: </span>
                    <span className="font-semibold text-foreground uppercase">{instagramAccount.sync_tier}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Views Insights: </span>
                    <span className="font-semibold text-foreground">
                      {instagramAccount.capabilities?.views_insights || (latestData?.totalViews24h !== null && latestData?.totalViews24h !== undefined)
                        ? `Supported (${latestData?.totalViews24h ?? 0} views/24h)`
                        : (instagramAccount.capabilities?.errors?.views_insights
                            ? `Unavailable (${instagramAccount.capabilities.errors.views_insights})`
                            : 'Unavailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Demographics: </span>
                    <span className="font-semibold text-foreground">
                      {instagramAccount.capabilities?.demographics_gender_age || latestData?.demographics
                        ? 'Supported'
                        : (instagramAccount.capabilities?.errors?.demographics_gender_age
                            ? `Unavailable (${instagramAccount.capabilities.errors.demographics_gender_age})`
                            : 'Unavailable')}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Next Scheduled Sync: </span>
                    <span className="font-semibold text-foreground">
                      {instagramAccount.next_sync_at
                        ? new Date(instagramAccount.next_sync_at).toLocaleString()
                        : 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Instagram Graph API (Unified Login)</span>
            {instagramAccount ? (
              <div className="flex items-center gap-2">
                {instagramAccount.status === 'RECONNECT_REQUIRED' ? (
                  <a
                    href="/creator/me/social-accounts/instagram/connect"
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-foreground text-xs font-bold transition"
                  >
                    Reconnect Token
                  </a>
                ) : (
                  <button
                    onClick={() => handleSyncNow('instagram')}
                    disabled={syncing}
                    className="px-3 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold transition disabled:opacity-50"
                  >
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                )}
                <button
                  onClick={() => handleDisconnect('instagram')}
                  disabled={disconnecting}
                  className="px-3 py-1.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-bold transition disabled:opacity-50"
                >
                  {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            ) : instagramCap.configured ? (
              <a
                href="/creator/me/social-accounts/instagram/connect"
                className="px-3 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs transition"
              >
                Connect Instagram
              </a>
            ) : (
              <button
                disabled
                title={instagramCap.reason || 'Instagram: Not configured in server environment'}
                className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
              >
                Not Available
              </button>
            )}
          </div>
        </div>

        {/* Google / YouTube */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {youtubeAccount?.profile_picture_url ? (
                  <img
                    src={youtubeAccount.profile_picture_url}
                    alt={youtubeAccount.account_type || youtubeAccount.username}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    <SocialPlatformIcon platform="youtube" size={40} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm text-foreground">YouTube</h3>
                  <p className="text-xs text-muted-foreground">Read-only channel stats &amp; viewer analytics</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  youtubeAccount?.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300 border border-emerald-500/20'
                    : youtubeAccount?.status === 'RECONNECT_REQUIRED'
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                    : youtubeCap.configured
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {youtubeAccount?.status === 'ACTIVE'
                  ? 'Connected & Verified'
                  : youtubeAccount?.status === 'RECONNECT_REQUIRED'
                  ? 'Reconnect Required'
                  : youtubeCap.configured
                  ? 'Ready to Connect'
                  : 'Not Configured'}
              </span>
            </div>

            {youtubeAccount ? (
              <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">
                      {youtubeAccount.account_type || youtubeAccount.username}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {youtubeAccount.username} &bull; Connected{' '}
                      {new Date(youtubeAccount.connected_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-base text-foreground">
                      {youtubeAccount.capabilities?.hiddenSubscriberCount
                        ? 'Hidden'
                        : youtubeAccount.followers_count.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {youtubeAccount.capabilities?.hiddenSubscriberCount
                        ? 'Hidden by creator'
                        : 'Subscribers (YouTube)'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Videos: </span>
                    <span className="font-semibold text-foreground">{youtubeAccount.media_count.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Channel Views: </span>
                    <span className="font-semibold text-foreground">
                      {typeof youtubeAccount.capabilities?.totalChannelViews === 'number'
                        ? youtubeAccount.capabilities.totalChannelViews.toLocaleString()
                        : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Synced: </span>
                    <span className="font-semibold text-foreground">
                      {youtubeAccount.last_synced_at
                        ? new Date(youtubeAccount.last_synced_at).toLocaleDateString()
                        : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data Through: </span>
                    <span className="font-semibold text-foreground">
                      {youtubeAccount.capabilities?.dataThroughDate || 'Pending sync'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Analytics Series: </span>
                    <span className="font-semibold text-foreground">
                      {youtubeAccount.capabilities?.analyticsDailySeries?.available
                        ? 'Supported'
                        : youtubeAccount.capabilities?.analyticsDailySeries?.reason
                        ? `Not available: ${youtubeAccount.capabilities.analyticsDailySeries.reason}`
                        : 'Pending sync'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Viewer Demographics: </span>
                    <span className="font-semibold text-foreground">
                      {youtubeAccount.capabilities?.viewerDemographics?.available
                        ? 'Supported (Google estimate)'
                        : youtubeAccount.capabilities?.viewerDemographics?.reason
                        ? `Not available: ${youtubeAccount.capabilities.viewerDemographics.reason}`
                        : 'Pending sync'}
                    </span>
                  </div>
                </div>

                {showYtDisconnectOptions && (
                  <div className="p-3 rounded-xl bg-background border border-border space-y-2 text-xs">
                    <div className="font-semibold text-foreground">Disconnect YouTube Channel</div>
                    <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ytDeleteMetrics}
                        onChange={(e) => setYtDeleteMetrics(e.target.checked)}
                      />
                      Also delete stored historical YouTube metrics and snapshots
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDisconnect('youtube', ytDeleteMetrics)}
                        disabled={disconnecting}
                        className="px-3 py-1 rounded-lg bg-destructive text-destructive-foreground text-[11px] font-bold"
                      >
                        {disconnecting ? 'Disconnecting...' : 'Confirm Disconnect'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowYtDisconnectOptions(false)}
                        className="px-3 py-1 rounded-lg border border-border text-[11px] text-muted-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1.5">
                <div className="font-semibold text-foreground">Before you connect (Read-Only Access):</div>
                <p>
                  Adzunova requests read-only scopes (<code className="text-foreground">youtube.readonly</code> and{' '}
                  <code className="text-foreground">yt-analytics.readonly</code>) to verify subscriber count, views, and
                  viewer demographics. We never write to or modify your channel, and never use YouTube data to train AI
                  models.
                </p>
                <p>
                  You can disconnect anytime here or revoke access at{' '}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-foreground"
                  >
                    Google Account Permissions
                  </a>
                  .
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {youtubeAccount
                ? `Next sync: ${
                    youtubeAccount.next_sync_at
                      ? new Date(youtubeAccount.next_sync_at).toLocaleDateString()
                      : 'Scheduled'
                  }`
                : youtubeCap.configured
                ? 'Official Google OAuth'
                : 'Not configured'}
            </span>
            <div className="flex items-center gap-2">
              {youtubeAccount ? (
                <>
                  {youtubeAccount.status === 'RECONNECT_REQUIRED' ? (
                    <a
                      href="/creator/me/social-accounts/youtube/connect"
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs transition"
                    >
                      Reconnect YouTube
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSyncNow('youtube')}
                      disabled={syncing}
                      className="px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition"
                    >
                      {syncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowYtDisconnectOptions((v) => !v)}
                    disabled={disconnecting}
                    className="px-3 py-1.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold transition"
                  >
                    Disconnect
                  </button>
                </>
              ) : youtubeCap.configured ? (
                <a
                  href="/creator/me/social-accounts/youtube/connect"
                  className="px-3 py-1.5 rounded-xl bg-destructive hover:opacity-90 text-destructive-foreground text-xs font-bold shadow-xs transition"
                >
                  Connect YouTube
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title={youtubeCap.reason || 'Not configured'}
                  className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
                >
                  Not Configured
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TikTok */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <SocialPlatformIcon platform="tiktok" size={40} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">TikTok</h3>
                <p className="text-xs text-muted-foreground">Follower counts, video plays & audience profile</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
              Not Available
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">TikTok for Creators API</span>
            <button
              disabled
              title="TikTok API credentials not configured"
              className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
            >
              Not Available
            </button>
          </div>
        </div>

        {/* X / Twitter */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <SocialPlatformIcon platform="x" size={40} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">X (Twitter)</h3>
                <p className="text-xs text-muted-foreground">Followers & impressions verification</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
              Not Available
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">X API v2</span>
            <button
              disabled
              title="X API client credentials not configured"
              className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
            >
              Not Available
            </button>
          </div>
        </div>

        {/* Facebook */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <SocialPlatformIcon platform="facebook" size={40} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Facebook</h3>
                <p className="text-xs text-muted-foreground">Page likes, reach & engagement analytics</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
              Not Available
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Meta Graph API v21.0</span>
            <button
              disabled
              title="Facebook Page integration not configured"
              className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
            >
              Not Available
            </button>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <SocialPlatformIcon platform="linkedin" size={40} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">LinkedIn</h3>
                <p className="text-xs text-muted-foreground">Professional network connections & post impressions</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
              Not Available
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Official LinkedIn OAuth 2.0</span>
            <button
              disabled
              title="LinkedIn API client not configured"
              className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold cursor-not-allowed"
            >
              Not Available
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
