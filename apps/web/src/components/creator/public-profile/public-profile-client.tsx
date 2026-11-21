'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicCreatorProfileDTO, PublicRateCardItemDTO } from '@/lib/public-profile/types';
import { SocialPlatformIcon } from '@/components/creator/ui/social-platform-icon';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { Logo } from '@/components/brand/Logo';
import { QrCode } from '@/components/ui/qr-code';
import { formatIndianRupees, formatCompactCount, formatVerifiedViaLabel } from '@/lib/public-profile/formatters';

interface PublicProfileClientProps {
  profile: PublicCreatorProfileDTO;
}

export function PublicProfileClient({ profile }: PublicProfileClientProps) {
  const router = useRouter();
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<string>('ALL');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHowBookingWorksOpen, setIsHowBookingWorksOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [avatarImgFailed, setAvatarImgFailed] = useState(false);

  // Report state
  const [reportReason, setReportReason] = useState<'IMPERSONATION' | 'MISLEADING_STATS' | 'HARASSMENT' | 'SCAM' | 'OTHER'>('MISLEADING_STATS');
  const [reportDetails, setReportDetails] = useState('');
  const [reportHoneypot, setReportHoneypot] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : profile.seo.canonicalUrl;

  // Track privacy-safe view event on mount
  useEffect(() => {
    fetch(`/api/public/creators/${profile.slug}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'VIEW' }),
    }).catch(() => null);
  }, [profile.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    fetch(`/api/public/creators/${profile.slug}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'SHARE_CLICK', metadata: { method: 'copy_link' } }),
    }).catch(() => null);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: profile.seo.title,
          text: profile.seo.description,
          url: shareUrl,
        });
        fetch(`/api/public/creators/${profile.slug}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: 'SHARE_CLICK', metadata: { method: 'web_share' } }),
        }).catch(() => null);
        return;
      } catch {}
    }
    setIsShareModalOpen(true);
  };

  const handleMessageCreator = () => {
    // 5.7 Brand messaging future extension point
    // Redirects unauthenticated / brand user to login with returnUrl & creator context preserved
    fetch(`/api/public/creators/${profile.slug}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'MESSAGE_CTA_CLICK' }),
    }).catch(() => null);

    const redirectTarget = encodeURIComponent(`/c/${profile.slug}`);
    router.push(`/auth/brand/sign-in?returnUrl=${redirectTarget}&creatorSlug=${profile.slug}`);
  };

  const handlePlatformClick = (platformName: string) => {
    fetch(`/api/public/creators/${profile.slug}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'PLATFORM_LINK_CLICK', metadata: { platform: platformName } }),
    }).catch(() => null);
  };

  const handleRateCardViewed = () => {
    fetch(`/api/public/creators/${profile.slug}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'RATECARD_VIEW' }),
    }).catch(() => null);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitting(true);
    setReportError(null);

    try {
      const res = await fetch(`/api/public/creators/${profile.slug}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails,
          honeypot: reportHoneypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
        setReportDetails('');
      }, 2500);
    } catch (err: any) {
      setReportError(err.message || 'Error sending report.');
    } finally {
      setReportSubmitting(false);
    }
  };

  // Filter rate card items by active tab
  const rateCardItems = profile.rateCard?.items || [];
  const platformsInRateCard = Array.from(new Set(rateCardItems.map((i) => i.platform)));

  const filteredRateCardItems = selectedPlatformTab === 'ALL'
    ? rateCardItems
    : rateCardItems.filter((i) => i.platform === selectedPlatformTab);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/20">
      {/* 1. Subtle Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-70" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo variant="full" size="sm" badgeText="VERIFIED CREATOR" href="/" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleNativeShare}
              className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShellIcon name="Share2" size={13} />
              <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            <button
              onClick={handleMessageCreator}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Message Creator
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* =========================================================================
            3.1 HEADER / HERO SECTION
            ========================================================================= */}
        <section className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs overflow-hidden">
          {profile.coverUrl && (
            <div className="absolute top-0 left-0 right-0 h-32 opacity-30 overflow-hidden pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.coverUrl} alt="Cover banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
            {/* Creator Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-border shadow-md bg-muted shrink-0">
                {profile.avatarUrl && !avatarImgFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarImgFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-inner">
                    {profile.displayName[0] || 'C'}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {profile.displayName}
                  </h1>
                  {profile.isVerifiedCreator && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-2xs">
                      <ShellIcon name="CheckCircle" size={12} className="text-emerald-500" />
                      Verified Creator
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono font-medium text-foreground">{profile.handle}</span>
                  {profile.location && (
                    <>
                      <span>•</span>
                      <span>📍 {profile.location}</span>
                    </>
                  )}
                  {profile.languages?.length > 0 && (
                    <>
                      <span>•</span>
                      <span>🗣️ {profile.languages.join(', ')}</span>
                    </>
                  )}
                </div>

                {/* Category Tags */}
                {profile.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-muted text-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Last Verified */}
            <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleNativeShare}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ShellIcon name="Share2" size={14} />
                  <span>Share Profile</span>
                </button>

                <button
                  onClick={handleMessageCreator}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShellIcon name="Send" size={14} />
                  <span>Message Creator</span>
                </button>
              </div>

              {profile.lastVerifiedAt && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShellIcon name="Shield" size={11} className="text-emerald-500" />
                  {formatVerifiedViaLabel(profile.lastVerifiedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Short Bio (Max 280 chars) */}
          {profile.bio && (
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {profile.bio}
              </p>
            </div>
          )}
        </section>

        {/* =========================================================================
            3.2 CONNECTED PLATFORMS SECTION
            ========================================================================= */}
        {profile.platforms && profile.platforms.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Verified Connected Channels</h2>
                <p className="text-xs text-muted-foreground">Ingested through first-party OAuth APIs. Never self-reported.</p>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {profile.platforms.length} Channel{profile.platforms.length !== 1 ? 's' : ''} Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.platforms.map((ch) => (
                <div
                  key={ch.platform + ch.handle}
                  className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 hover:border-border/80 transition shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                          <SocialPlatformIcon platform={ch.platform} size={40} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-foreground">{ch.platform}</span>
                            {ch.verificationStatus === 'VERIFIED' && (
                              <ShellIcon name="CheckCircle" size={13} className="text-emerald-500" />
                            )}
                          </div>
                          <a
                            href={ch.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            onClick={() => handlePlatformClick(ch.platform)}
                            className="text-xs text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 font-mono transition flex items-center gap-1"
                          >
                            <span>{ch.handle}</span>
                            <ShellIcon name="ExternalLink" size={10} />
                          </a>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>

                    {/* Channel Stats Matrix */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                      <div className="p-2 rounded-xl bg-muted/40">
                        <div className="text-sm font-black text-foreground">
                          {formatCompactCount(ch.followers)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Followers</div>
                      </div>

                      <div className="p-2 rounded-xl bg-muted/40">
                        <div className="text-sm font-black text-foreground">
                          {ch.avgViews > 0 ? formatCompactCount(ch.avgViews) : '—'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">24h Views</div>
                      </div>

                      <div className="p-2 rounded-xl bg-muted/40">
                        <div className="text-sm font-black text-foreground">
                          {ch.contentCount > 0 ? ch.contentCount : '—'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Posts</div>
                      </div>
                    </div>
                  </div>

                  {/* Verification & Stale Label */}
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{ch.verifiedLabel}</span>
                    {ch.isStale && (
                      <span className="text-amber-500 font-medium">Data as of {new Date(ch.fetchedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            3.3 AGGREGATE STATS SECTION
            ========================================================================= */}
        {profile.stats && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">Aggregate Performance</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card">
                <span className="text-xs text-muted-foreground block mb-1">Total Verified Reach</span>
                <div className="text-2xl font-black text-foreground">
                  {formatCompactCount(profile.stats.totalVerifiedReach)}
                </div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold block mt-1">
                  100% Platform Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card">
                <span className="text-xs text-muted-foreground block mb-1">Published Content</span>
                <div className="text-2xl font-black text-foreground">
                  {profile.stats.totalPublishedContent}
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Active media items
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card">
                <span className="text-xs text-muted-foreground block mb-1">Avg Engagement</span>
                <div className="text-2xl font-black text-foreground">
                  {profile.stats.averageEngagementRate}%
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Industry benchmark standard
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card">
                <span className="text-xs text-muted-foreground block mb-1">Audience Quality</span>
                <div className="text-2xl font-black text-foreground">
                  {profile.stats.audienceQualityScore !== null ? `${profile.stats.audienceQualityScore}/100` : profile.stats.audienceQualityDisplay}
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1 truncate">
                  {profile.stats.qualityReason || 'Real engagement events'}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            3.4 AUDIENCE INSIGHTS SECTION (AGGREGATE ONLY, DPDP MINOR PROTECTED)
            ========================================================================= */}
        {profile.audience && (
          <section className="p-6 rounded-3xl border border-border bg-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground">Audience Demographics</h2>
                <p className="text-xs text-muted-foreground">Aggregated, privacy-compliant breakdown from {profile.audience.sourceLabel}.</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                18+ Audience Ratio: {profile.audience.share18Plus !== null ? `${profile.audience.share18Plus}%` : 'Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Age Segments */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Age Distribution</span>
                <div className="space-y-2">
                  {profile.audience.ageDistribution.map((item) => (
                    <div key={item.bucket} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.bucket} yrs</span>
                        <span className="font-semibold text-foreground">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {profile.audience.share13To17 !== null && (
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      Minor (13-17) aggregate: {profile.audience.share13To17}%
                    </span>
                  )}
                </div>
              </div>

              {/* Gender Split */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Gender Distribution</span>
                <div className="space-y-2">
                  {profile.audience.genderDistribution.map((g) => (
                    <div key={g.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{g.label}</span>
                        <span className="font-semibold text-foreground">{g.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all"
                          style={{ width: `${g.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Geography */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Top Geography</span>
                <div className="space-y-2">
                  {profile.audience.topCountries.map((c) => (
                    <div key={c.countryCode} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{c.countryName}</span>
                        <span className="font-semibold text-foreground">{c.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            3.5 TOP CONTENT SECTION
            ========================================================================= */}
        {profile.topContent && profile.topContent.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Featured Creative Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.topContent.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-indigo-500/40 transition shadow-xs flex flex-col"
                >
                  <div className="relative h-44 bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {post.isPinned && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
                        📌 Pinned
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-xs text-foreground text-[10px] font-semibold border border-border/40">
                      {post.platform}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                      <span>👁️ {formatCompactCount(post.views)} views</span>
                      <span>❤️ {formatCompactCount(post.likes)} likes</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            3.6 PUBLIC RATE CARD (ACTIVE & VISIBLE ITEMS ONLY)
            ========================================================================= */}
        {profile.rateCard && (
          <section
            onMouseEnter={handleRateCardViewed}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-foreground">Official Creator Rate Card</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Live Verified Pricing
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pre-configured deliverables and licensing add-ons available for direct brand sponsorships.
                </p>
              </div>

              {profile.rateCard.startingPriceInr && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                    Starting From
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">
                    {formatIndianRupees(profile.rateCard.startingPriceInr)}
                  </span>
                </div>
              )}
            </div>

            {/* Platform Tab Filters */}
            {platformsInRateCard.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                <button
                  onClick={() => setSelectedPlatformTab('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedPlatformTab === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Platforms ({rateCardItems.length})
                </button>
                {platformsInRateCard.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatformTab(p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedPlatformTab === p
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <SocialPlatformIcon platform={p} size={14} />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Deliverables List */}
            <div className="space-y-4">
              {filteredRateCardItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No deliverables currently configured for this platform.
                </div>
              ) : (
                filteredRateCardItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-border bg-background/60 hover:border-indigo-500/30 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Platform & Format Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-card shadow-2xs">
                            <SocialPlatformIcon platform={item.platform} size={12} />
                            <span>{item.platform}</span>
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground border border-border">
                            {item.contentFormat}
                          </span>

                          {item.publishOnMyChannel && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              Channel Placement
                            </span>
                          )}

                          {item.scriptApprovalRequired && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                              Script Approval
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-foreground leading-snug">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                            {item.description}
                          </p>
                        )}

                        {/* Specs strip */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>⏱️ {item.deliveryDays}d delivery turnaround</span>
                          <span>•</span>
                          <span>🔄 {item.freeRevisions} free revision{item.freeRevisions !== 1 ? 's' : ''}</span>
                          {item.durationSeconds && (
                            <>
                              <span>•</span>
                              <span>⌛ {item.durationSeconds >= 60 ? `${Math.round(item.durationSeconds / 60)}m` : `${item.durationSeconds}s`}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quoted Pricing */}
                      <div className="text-left sm:text-right shrink-0">
                        {item.isPriceHidden || item.price === null ? (
                          <div className="inline-flex flex-col items-start sm:items-end">
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              Request Quote
                            </span>
                            <span className="text-[10px] text-muted-foreground">Custom scope pricing</span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xl sm:text-2xl font-black text-foreground">
                              {formatIndianRupees(item.price)}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                              {item.priceType === 'FIXED' ? 'Fixed Price' : 'Starting Rate'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Configured Add-ons */}
                    {item.addons && item.addons.length > 0 && (
                      <div className="pt-3 border-t border-border/60">
                        <span className="text-[11px] font-bold text-muted-foreground block mb-2">
                          Available Add-ons &amp; Licensing Tiers:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {item.addons.map((addon) => (
                            <div
                              key={addon.type}
                              className="p-2 rounded-xl bg-card border border-border text-xs flex items-center justify-between"
                            >
                              <span className="text-foreground text-[11px] font-medium">{addon.label}</span>
                              <span className="font-bold text-[11px] text-indigo-600 dark:text-indigo-400 ml-2">
                                {addon.pricingMode === 'PERCENT_OF_BASE'
                                  ? `+${addon.value}%`
                                  : `+₹${addon.value.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Rate Card Footer Notice & Collapsible Explainer */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                Final pricing confirmed at booking. Taxes extra. &bull; Updated {new Date(profile.rateCard.updatedAt).toLocaleDateString()}
              </span>

              <button
                type="button"
                onClick={() => setIsHowBookingWorksOpen(!isHowBookingWorksOpen)}
                className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isHowBookingWorksOpen ? 'Hide booking process' : 'How booking works'}</span>
                <ShellIcon name={isHowBookingWorksOpen ? 'ChevronUp' : 'ChevronDown'} size={14} />
              </button>
            </div>

            {/* Collapsed "How Booking Works" Explainer */}
            {isHowBookingWorksOpen && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs space-y-3 animate-in fade-in duration-200">
                <span className="font-bold text-foreground block">The Adzunova Verified Sponsorship Process:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">1. Agreement</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Brand selects deliverable and submits creative brief. Terms and dates are locked.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">2. Escrow Deposit</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Sponsorship budget is safely deposited in Adzunova Escrow before shoot begins.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">3. Review &amp; Payout</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Content is reviewed, script signed off, published live, and payout released instantly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            3.7 PACKAGES SECTION
            ========================================================================= */}
        {profile.packages && profile.packages.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Campaign Packages &amp; Bundles</h2>
              <p className="text-xs text-muted-foreground">Multi-platform bundled packages designed for maximum brand reach.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{pkg.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{pkg.tagline}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-foreground">
                          {formatIndianRupees(pkg.priceInr)}
                        </div>
                        <span className="text-[10px] text-muted-foreground">Package price</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border space-y-1.5">
                      <span className="text-[11px] font-semibold text-foreground block">Included Deliverables:</span>
                      {pkg.deliverables.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ShellIcon name="Check" size={12} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">⏱️ {pkg.turnaroundDays}d SLA &bull; {pkg.revisions} Revisions</span>
                    <button
                      onClick={handleMessageCreator}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Book Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            3.8 TRUST BLOCK & ABUSE REPORT
            ========================================================================= */}
        <section className="p-6 rounded-3xl border border-border bg-card/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 shrink-0">
              <ShellIcon name="ShieldCheck" size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">Adzunova Verified Trust Guarantee</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xl leading-relaxed">
                All platform audience counts, impressions, and engagement metrics on this page are continuously ingested directly via official Meta and Google partner APIs. Numbers can never be manipulated by creators.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition cursor-pointer shrink-0"
          >
            <ShellIcon name="AlertTriangle" size={12} />
            <span>Report this profile</span>
          </button>
        </section>

      </main>

      {/* =========================================================================
          3.9 FOOTER SECTION
          ========================================================================= */}
      <footer className="border-t border-border bg-card/40 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">Powered by Adzunova</span>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>

          <div className="flex items-center gap-3">
            <span>Are you a brand or agency?</span>
            <Link
              href="/auth/brand/sign-up"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up as a Brand &rarr;
            </Link>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          SHARE MODAL (WITH QR CODE & SOCIAL CHANNELS)
          ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Share Creator Profile</h3>
                <p className="text-xs text-muted-foreground">Direct brands and partners to verified stats &amp; rate card.</p>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ShellIcon name="X" size={16} />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <QrCode value={shareUrl} size={150} centerLogo />
              <span className="text-[11px] text-muted-foreground font-mono">Scan on mobile to view</span>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${profile.displayName}'s verified creator media kit & rate card on Adzunova: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex flex-col items-center gap-1 transition"
              >
                <span className="text-base">💬</span>
                <span className="text-[10px]">WhatsApp</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex flex-col items-center gap-1 transition"
              >
                <span className="text-base">💼</span>
                <span className="text-[10px]">LinkedIn</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Verified Media Kit & Rate Card for ${profile.displayName}:`)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex flex-col items-center gap-1 transition"
              >
                <span className="text-base">𝕏</span>
                <span className="text-[10px]">X / Twitter</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`${profile.displayName} — Verified Creator Rate Card`)}&body=${encodeURIComponent(`Review verified audience reach and deliverables here: ${shareUrl}`)}`}
                className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex flex-col items-center gap-1 transition"
              >
                <span className="text-base">✉️</span>
                <span className="text-[10px]">Email</span>
              </a>
            </div>

            {/* Direct Link Copy */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-mono text-muted-foreground outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REPORT PROFILE MODAL
          ========================================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShellIcon name="AlertTriangle" size={16} className="text-destructive" />
                Report this Profile
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <ShellIcon name="X" size={16} />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold text-center">
                Report submitted successfully. Our trust &amp; safety team will investigate.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                {reportError && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs">
                    {reportError}
                  </div>
                )}

                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="user_note_extra"
                  value={reportHoneypot}
                  onChange={(e) => setReportHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="font-semibold text-foreground block mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e: any) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                  >
                    <option value="MISLEADING_STATS">Inaccurate or misleading metrics</option>
                    <option value="IMPERSONATION">Impersonation of another person/brand</option>
                    <option value="HARASSMENT">Harassment or abusive content</option>
                    <option value="SCAM">Scam or fraudulent deliverable</option>
                    <option value="OTHER">Other violation</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Details &amp; Evidence</label>
                  <textarea
                    rows={4}
                    required
                    minLength={5}
                    placeholder="Describe the issue with specific details or links..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-foreground"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:opacity-90 transition"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
