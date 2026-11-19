'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface SocialAccountItem {
  id: string;
  provider: 'instagram';
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
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [instagramCap, setInstagramCap] = useState<CapabilityState>({
    configured: false,
    status: 'NOT_CONFIGURED',
    reason: 'Checking configuration...',
  });

  // Check URL params for OAuth return status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      const error = params.get('error');
      const message = params.get('message');
      const username = params.get('username');

      if (success === 'instagram_connected') {
        setFeedback({
          type: 'success',
          message: username
            ? `Successfully connected Instagram professional account @${username}. Initial sync complete.`
            : 'Successfully connected Instagram account.',
        });
      } else if (error) {
        setFeedback({
          type: 'error',
          message: message ? decodeURIComponent(message) : `Connection error: ${error}`,
        });
      }
    }
  }, []);

  // Fetch capabilities and connected accounts
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [capRes, accRes] = await Promise.all([
          fetch('/api/capabilities'),
          fetch('/api/creator/social-accounts'),
        ]);

        if (capRes.ok) {
          const capData = await capRes.json();
          if (capData.social?.metaInstagram) {
            setInstagramCap(capData.social.metaInstagram);
          }
        }

        if (accRes.ok) {
          const accData = await accRes.json();
          setAccounts(accData.accounts || []);
        }
      } catch (err) {
        console.warn('Failed to load accounts data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const instagramAccount = accounts.find((a) => a.provider === 'instagram' && a.status === 'ACTIVE');

  const totalFollowers = accounts.reduce((sum, acc) => sum + Number(acc.followers_count || 0), 0);

  async function handleDisconnect(provider: 'instagram') {
    if (!window.confirm(`Are you sure you want to disconnect ${provider}? Your verified follower count and analytics sync will be stopped.`)) {
      return;
    }

    try {
      setDisconnecting(true);
      const res = await fetch(`/api/creator/social-accounts/${provider}/disconnect`, {
        method: 'POST',
      });

      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.provider !== provider));
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

  async function handleSyncNow(provider: 'instagram') {
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
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-75 transition font-bold text-xs"
            aria-label="Dismiss alert"
          >
            ✕
          </button>
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
          label="Total Audience Reach"
          value={loading ? '—' : totalFollowers.toLocaleString()}
          subValue="Sum of verified followers"
          icon={<ShellIcon name="User" size={16} />}
        />
        <StatCard
          label="Audience Quality Score"
          value={accounts.length === 0 ? '—' : 'Available with sync'}
          subValue="Calculated from real API events"
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
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  IG
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
                    ? 'bg-indigo-500/10 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-300 border border-indigo-500/20'
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
                      {instagramAccount.capabilities?.views_insights ? 'Supported' : 'Unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Demographics: </span>
                    <span className="font-semibold text-foreground">
                      {instagramAccount.capabilities?.demographics_gender_age ? 'Supported' : 'Unavailable'}
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
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
                  >
                    Reconnect Token
                  </a>
                ) : (
                  <button
                    onClick={() => handleSyncNow('instagram')}
                    disabled={syncing}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
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
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
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
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center font-bold">
                YT
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">YouTube</h3>
                <p className="text-xs text-muted-foreground">Sync channel subscribers & video views</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
              Not Connected
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Official Google OAuth</span>
            <a
              href="/api/auth/google?role=CREATOR&redirect=/creator/accounts"
              className="px-3 py-1.5 rounded-xl bg-destructive hover:opacity-90 text-destructive-foreground text-xs font-bold shadow-xs transition"
            >
              Connect YouTube
            </a>
          </div>
        </div>

        {/* TikTok */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center font-bold">
                TT
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
              <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center font-bold">
                X
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
      </div>
    </div>
  );
}
