'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { SocialPlatformIcon } from '@/components/creator/ui/social-platform-icon';
import { PublicProfile, SectionVisibility } from '@/lib/public-profile/types';
import { formatIndianRupees } from '@/lib/public-profile/formatters';
import { QrCode } from '@/components/ui/qr-code';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'details' | 'visibility' | 'pricing' | 'analytics'>('details');

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loginAvatar, setLoginAvatar] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [allowIndexing, setAllowIndexing] = useState(true);

  // Section Visibility
  const [visibility, setVisibility] = useState<SectionVisibility>({
    platforms: true,
    stats: true,
    audience: true,
    topContent: true,
    rateCard: true,
    packages: true,
  });

  // Price Hiding per Item
  const [hidePrices, setHidePrices] = useState<Record<string, boolean>>({});

  // Meta state
  const [completeness, setCompleteness] = useState<any>(null);
  const [latest, setLatest] = useState<any>(null);
  const [rateCardItems, setRateCardItems] = useState<any[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Slug Availability state
  const [slugStatus, setSlugStatus] = useState<{ checking: boolean; available?: boolean; reason?: string }>({ checking: false });
  const [debouncedSlug, setDebouncedSlug] = useState('');

  // Analytics state
  const [analyticsRange, setAnalyticsRange] = useState('30');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // QR Modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Debounce slug input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(slug.trim().toLowerCase());
    }, 400);
    return () => clearTimeout(timer);
  }, [slug]);

  // Check slug availability
  useEffect(() => {
    if (!debouncedSlug) return;
    async function check() {
      setSlugStatus({ checking: true });
      try {
        const res = await fetch(`/api/creator/public-profile/slug-available?slug=${encodeURIComponent(debouncedSlug)}`);
        const data = await res.json();
        setSlugStatus({ checking: false, available: data.available, reason: data.reason });
      } catch {
        setSlugStatus({ checking: false, available: false, reason: 'Error checking slug' });
      }
    }
    check();
  }, [debouncedSlug]);

  // Initial Load
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profRes, itemsRes] = await Promise.all([
        fetch('/api/creator/public-profile'),
        fetch('/api/creator/rate-card/items').catch(() => null),
      ]);

      if (profRes.ok) {
        const data = await profRes.json();
        const p: PublicProfile = data.profile;
        setDisplayName(p.displayName || '');
        setSlug(p.slug || '');
        setBio(p.bio || '');
        setTags(p.tags || []);
        setLanguages(p.languages?.length ? p.languages : ['English']);
        setLocation(p.location || '');
        setLoginAvatar(data.loginAvatar || null);
        const effectiveAvatar = p.avatarUrl && !/instagram|cdninstagram|scontent|fbcdn/i.test(p.avatarUrl)
          ? p.avatarUrl
          : (data.loginAvatar || null);
        setAvatarUrl(effectiveAvatar);
        setCoverUrl(p.coverUrl);
        setIsPublished(p.isPublished);
        setAllowIndexing(p.allowIndexing ?? true);
        setVisibility(p.sectionVisibility || {
          platforms: true,
          stats: true,
          audience: true,
          topContent: true,
          rateCard: true,
          packages: true,
        });
        setHidePrices(p.hidePricesPerItem || {});
        setCompleteness(data.completeness);
        setLatest(data.latestSocial);
      }

      if (itemsRes && itemsRes.ok) {
        const iData = await itemsRes.json();
        setRateCardItems(iData.items || []);
      }
    } catch (err) {
      console.warn('Failed to load profile settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Load Analytics when Analytics tab is opened
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetch(`/api/creator/public-profile/analytics?range=${analyticsRange}`)
        .then((res) => res.json())
        .then((data) => setAnalyticsData(data))
        .catch(() => null);
    }
  }, [activeTab, analyticsRange]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/creator/public-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          slug,
          bio,
          tags,
          languages,
          location,
          avatarUrl,
          coverUrl,
          allowIndexing,
          sectionVisibility: visibility,
          hidePricesPerItem: hidePrices,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to update profile');
        return;
      }

      const resData = await res.json();
      setCompleteness(resData.completeness);
      setIsSaved(true);
      setIsDirty(false);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      alert('Network error while saving profile');
    }
  };

  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      const endpoint = isPublished
        ? '/api/creator/public-profile/unpublish'
        : '/api/creator/public-profile/publish';

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to change publish status');
        return;
      }

      setIsPublished(!isPublished);
      alert(data.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = newTagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
        setTags([...tags, trimmed]);
        setNewTagInput('');
        setIsDirty(true);
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    setIsDirty(true);
  };

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/c/${slug}`
    : `https://adzunova.com/c/${slug}`;

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
          <div className="h-96 bg-card border border-border rounded-2xl" />
          <div className="h-96 bg-card border border-border rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Publish Toggle & Save */}
      <PageHeader
        title="Public Profile & Live Storefront"
        description="Your public, SEO-friendly media kit and verified rate card at /c/:slug. Share with brand sponsors to close deals."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Publish / Unpublish Master Switch */}
            <button
              onClick={handleTogglePublish}
              disabled={isPublishing}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isPublished
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isPublished ? 'Publicly Live' : 'Unpublished (Private)'}</span>
            </button>

            {/* View Live Page */}
            {isPublished && (
              <a
                href={`/c/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>View Public Page</span>
                <ShellIcon name="ExternalLink" size={13} />
              </a>
            )}

            {/* Save Button */}
            <button
              onClick={() => handleSave()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShellIcon name="Save" size={14} />
              <span>{isSaved ? 'Saved!' : 'Save Profile'}</span>
            </button>
          </div>
        }
      />

      {/* Profile Completeness Score Card */}
      {completeness && (
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Profile Completeness:</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                {completeness.score}%
              </span>
              <span className="text-[11px] text-muted-foreground">
                {completeness.score === 100 ? '🎉 Ready for brand discovery!' : 'Complete key steps to boost brand deal inquiries.'}
              </span>
            </div>

            <div className="w-full md:w-80 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completeness.score}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {completeness.checklist?.map((item: any) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                  item.completed
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                <ShellIcon name={item.completed ? 'Check' : 'Circle'} size={11} />
                <span>{item.label.split('(')[0]}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border text-xs font-semibold">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'details'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          1. Brand Identity &amp; Bio
        </button>

        <button
          onClick={() => setActiveTab('visibility')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'visibility'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          2. Section Visibility (DPDP)
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'pricing'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          3. Rate Card Price Controls
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          4. Storefront Analytics
        </button>
      </div>

      {/* Main Grid: Form / Settings Left + Live Preview Right */}
      <div className="grid grid-cols-1 desk:grid-cols-12 gap-6 items-start">

        {/* Left Column: Active Tab Content (7 Cols) */}
        <div className="desk:col-span-7 space-y-5">

          {/* TAB 1: IDENTITY & BIO */}
          {activeTab === 'details' && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Creator Storefront Details</h3>

              <div className="space-y-4 text-xs">
                {/* Custom URL Slug Editor with Live Availability */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-foreground">Custom Shareable URL Slug</label>
                    <span className="text-[11px] text-muted-foreground">https://adzunova.com/c/<strong>{slug || '...'}</strong></span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-mono text-muted-foreground text-xs">/c/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                        setIsDirty(true);
                      }}
                      placeholder="your-custom-slug"
                      className="w-full rounded-xl border border-border bg-background pl-8 pr-24 py-2 text-foreground font-mono text-xs focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="absolute right-3 top-2 text-[11px]">
                      {slugStatus.checking ? (
                        <span className="text-muted-foreground">Checking...</span>
                      ) : slugStatus.available === true ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <ShellIcon name="Check" size={12} /> Available
                        </span>
                      ) : slugStatus.available === false ? (
                        <span className="text-destructive font-semibold" title={slugStatus.reason}>
                          Taken
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    3-30 lowercase characters. If you change your slug, your old URL automatically 301 redirects to the new one.
                  </p>
                </div>

                {/* Display Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. Achhuta Nand Jha"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                    />
                  </div>
                </div>

                {/* Bio / Pitch (Max 280) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-foreground">Creator Bio (Pitch to Brands)</label>
                    <span className="text-[11px] text-muted-foreground">{bio.length} / 280</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={280}
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Describe your audience niche, engagement style, and what sets your content format apart..."
                    className="w-full rounded-xl border border-border bg-background p-3 text-foreground leading-relaxed focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Tags & Categories */}
                <div>
                  <label className="font-semibold text-foreground block mb-1">Content Tags &amp; Niches</label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-border bg-background min-h-[42px] items-center">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground text-xs"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {tags.length < 8 && (
                      <input
                        type="text"
                        placeholder="Add tag and press Enter..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="flex-1 min-w-[120px] bg-transparent outline-none text-xs text-foreground px-1"
                      />
                    )}
                  </div>
                </div>

                {/* Avatar & Cover URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-foreground">Avatar Image URL</label>
                      {loginAvatar && avatarUrl !== loginAvatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl(loginAvatar);
                            setIsDirty(true);
                          }}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Use Adzunova Account Photo
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={avatarUrl || ''}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value || null);
                        setIsDirty(true);
                      }}
                      placeholder={loginAvatar || "https://images.unsplash.com/..."}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Cover Banner URL</label>
                    <input
                      type="url"
                      value={coverUrl || ''}
                      onChange={(e) => {
                        setCoverUrl(e.target.value || null);
                        setIsDirty(true);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* SEO Indexing Toggle */}
                <div className="pt-2 border-t border-border">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-foreground block">Allow Search Engine Indexing (Google SEO)</span>
                      <span className="text-[11px] text-muted-foreground block">
                        When enabled, your public profile is indexed by Google, Bing, and social search cards.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowIndexing}
                      onChange={(e) => {
                        setAllowIndexing(e.target.checked);
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION VISIBILITY */}
          {activeTab === 'visibility' && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Public Section Visibility (DPDP Compliant)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select which sections are visible to non-logged in visitors on your public URL.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: 'platforms', label: 'Connected Platforms Strip', desc: 'Display official platform logos, handles, and verified badges.' },
                  { id: 'stats', label: 'Aggregate Stats Matrix', desc: 'Show Total Verified Reach, published content, and engagement benchmark.' },
                  { id: 'audience', label: 'Audience Insights (Aggregated)', desc: 'Show age segments, gender split, and geography (minors protected).' },
                  { id: 'topContent', label: 'Featured Portfolio / Top Posts', desc: 'Showcase pinned and recent high-performing creative content.' },
                  { id: 'rateCard', label: 'Creator Rate Card', desc: 'Display active deliverables, SLA turnaround, revisions, and starting rates.' },
                  { id: 'packages', label: 'Campaign Bundles & Packages', desc: 'Display curated multi-platform campaign packages.' },
                ].map((s) => (
                  <label
                    key={s.id}
                    className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">{s.label}</span>
                      <span className="text-[11px] text-muted-foreground block">{s.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={visibility[s.id as keyof SectionVisibility]}
                      onChange={(e) => {
                        setVisibility({ ...visibility, [s.id]: e.target.checked });
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer ml-4"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RATE CARD PRICING CONTROLS */}
          {activeTab === 'pricing' && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Per-Item Rate Card Price Privacy</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose whether to display the exact starting price or show &quot;Request Quote&quot; for high-tier deliverables.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {rateCardItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    No deliverables found in your rate card. Visit{' '}
                    <Link href="/creator/rate-card" className="text-indigo-600 font-bold underline">
                      Rate Card
                    </Link>{' '}
                    to configure items.
                  </div>
                ) : (
                  rateCardItems.map((item) => {
                    const isHidden = Boolean(hidePrices[item.id]);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <SocialPlatformIcon platform={item.platform} size={20} />
                          <div className="min-w-0">
                            <span className="font-bold text-foreground block truncate">{item.title}</span>
                            <span className="text-[11px] text-muted-foreground">
                              Base: {formatIndianRupees(item.price)} &bull; {item.deliveryDays}d SLA
                            </span>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                          <span className={`text-[11px] font-semibold ${isHidden ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {isHidden ? 'Request Quote (Price Hidden)' : 'Show Price'}
                          </span>
                          <input
                            type="checkbox"
                            checked={isHidden}
                            onChange={(e) => {
                              setHidePrices({ ...hidePrices, [item.id]: e.target.checked });
                              setIsDirty(true);
                            }}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </label>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: STOREFRONT ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Public Storefront Visitor Analytics</h3>
                  <p className="text-xs text-muted-foreground">Privacy-safe aggregate metrics for your public URL.</p>
                </div>

                <select
                  value={analyticsRange}
                  onChange={(e) => setAnalyticsRange(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground font-semibold"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>

              {analyticsData ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <span className="text-[11px] text-muted-foreground block">Page Views</span>
                      <span className="text-xl font-black text-foreground">{analyticsData.pageViews}</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <span className="text-[11px] text-muted-foreground block">Unique Visitors</span>
                      <span className="text-xl font-black text-foreground">{analyticsData.uniqueVisitors}</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <span className="text-[11px] text-muted-foreground block">Rate Card Views</span>
                      <span className="text-xl font-black text-foreground">{analyticsData.rateCardViews}</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-background">
                      <span className="text-[11px] text-muted-foreground block">Share Events</span>
                      <span className="text-xl font-black text-foreground">{analyticsData.shareEvents}</span>
                    </div>
                  </div>

                  {/* Top Referrers */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-bold text-foreground block">Top Traffic Referrers</span>
                    <div className="space-y-1">
                      {analyticsData.topReferrers?.map((r: any) => (
                        <div key={r.referrer} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40">
                          <span className="text-muted-foreground">{r.referrer}</span>
                          <span className="font-bold text-foreground">{r.count} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                  Loading analytics...
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Live "Preview As Brand" (5 Cols) */}
        <div className="desk:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShellIcon name="Eye" size={14} className="text-indigo-600 dark:text-indigo-400" />
                Live Brand Preview
              </span>

              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2 py-0.5 rounded-md transition ${previewMode === 'desktop' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'}`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2 py-0.5 rounded-md transition ${previewMode === 'mobile' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'}`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Rendered Preview Card */}
            <div
              className={`mx-auto rounded-2xl border border-border bg-background p-4 shadow-xs space-y-4 transition-all ${
                previewMode === 'mobile' ? 'max-w-[280px]' : 'w-full'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                      {displayName[0] || 'C'}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-foreground truncate">{displayName || 'Creator'}</h4>
                    {latest?.hasConnectedAccount && (
                      <ShellIcon name="CheckCircle" size={13} className="text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground block truncate">/c/{slug || '...'}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {bio || 'Your creator bio and pitch to brands will appear here.'}
              </p>

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Verified Reach:</span>
                  <span className="font-bold text-foreground">
                    {latest?.hasConnectedAccount ? `${Number(latest.totalReach || 0).toLocaleString()} followers` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Audience Score:</span>
                  <span className="font-bold text-foreground">{latest?.audienceScoreDisplay || 'Not enough data'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[10px]">
                  {isPublished ? '🟢 Publicly Visible' : '⚪ Private / Unpublished'}
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {visibility.rateCard ? 'Rate Card Active' : 'Rate Card Hidden'}
                </span>
              </div>
            </div>

            {/* Quick Share Link & QR Button */}
            <div className="pt-2 border-t border-border flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPublicLink}
                className="flex-1 py-2 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ShellIcon name="Copy" size={13} />
                <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="py-2 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ShellIcon name="QrCode" size={13} />
                <span>Show QR</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 text-center animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Your Storefront QR Code</h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <ShellIcon name="X" size={16} />
              </button>
            </div>

            <div className="flex justify-center p-2">
              <QrCode value={publicUrl} size={180} centerLogo />
            </div>

            <p className="text-xs font-mono text-muted-foreground break-all">
              {publicUrl}
            </p>

            <button
              onClick={handleCopyPublicLink}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
            >
              {copiedLink ? 'Copied to Clipboard!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
