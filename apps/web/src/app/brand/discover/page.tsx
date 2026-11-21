'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { BrandPageContainer } from '@/components/brand/shell/brand-page-container';
import { CreatorCardData, SearchFacets } from '@/lib/discovery/search-types';
import { buildComparisonMatrix, ComparisonMatrix } from '@/lib/discovery/shortlist-service';

export default function BrandDiscoverPage() {
  // Query States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'instagram' | 'youtube'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minFollowers, setMinFollowers] = useState<number | undefined>(undefined);
  const [maxFollowers, setMaxFollowers] = useState<number | undefined>(undefined);
  const [min18PlusShare, setMin18PlusShare] = useState<number | undefined>(undefined);
  const [audienceCountry, setAudienceCountry] = useState<string>('');
  const [deliverableFormat, setDeliverableFormat] = useState<string>('ANY');
  const [sortBy, setSortBy] = useState<string>('best_match');

  // Budget-First Search States
  const [isBudgetFirst, setIsBudgetFirst] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState<number>(50000);

  // Results State
  const [creators, setCreators] = useState<CreatorCardData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [facets, setFacets] = useState<SearchFacets | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Compare & Shortlist State
  const [selectedForCompare, setSelectedForCompare] = useState<CreatorCardData[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (selectedPlatform !== 'all') params.set('platform', selectedPlatform);
      if (selectedCategory) params.set('category', selectedCategory);
      if (minFollowers !== undefined) params.set('min_followers', String(minFollowers));
      if (maxFollowers !== undefined) params.set('max_followers', String(maxFollowers));
      if (min18PlusShare !== undefined) params.set('min_18_plus_share', String(min18PlusShare));
      if (audienceCountry) params.set('country', audienceCountry);
      if (deliverableFormat && deliverableFormat !== 'ANY') params.set('format', deliverableFormat);
      if (sortBy) params.set('sort_by', sortBy);

      if (isBudgetFirst && budgetAmount > 0) {
        params.set('budget_amount', String(budgetAmount));
      }

      const res = await fetch(`/api/discovery/creators?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCreators(json.data || []);
        setTotalCount(json.pagination?.totalCount || 0);
        setFacets(json.facets || null);
      }
    } catch (e) {
      console.error('Failed to load creators', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCreators();
    }, 250);
    return () => clearTimeout(timer);
  }, [
    searchTerm,
    selectedPlatform,
    selectedCategory,
    minFollowers,
    maxFollowers,
    min18PlusShare,
    audienceCountry,
    deliverableFormat,
    sortBy,
    isBudgetFirst,
    budgetAmount,
  ]);

  const toggleCompare = (creator: CreatorCardData) => {
    const exists = selectedForCompare.some((c) => c.creatorId === creator.creatorId);
    if (exists) {
      setSelectedForCompare(selectedForCompare.filter((c) => c.creatorId !== creator.creatorId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 creators side by side.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, creator]);
    }
  };

  const toggleShortlist = async (creatorId: string) => {
    try {
      const res = await fetch('/api/brand/shortlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', creatorId }),
      });
      if (res.ok) {
        const json = await res.json();
        setShortlistedIds((prev) => {
          const next = new Set(prev);
          if (json.inShortlist) next.add(creatorId);
          else next.delete(creatorId);
          return next;
        });
      }
    } catch (e) {
      console.error('Failed to update shortlist', e);
    }
  };

  const comparisonMatrix: ComparisonMatrix | null =
    selectedForCompare.length > 0 ? buildComparisonMatrix(selectedForCompare) : null;

  return (
    <BrandPageContainer
      title="Discover Talent"
      category="MAIN"
      description="Search and filter verified creators with real first-party analytics and rate cards"
      iconName="Compass"
    >
      <div className="space-y-6 max-w-7xl">
        {/* Top Control Bar */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search by creator name, @handle, niche or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Budget-First Toggle Pill */}
              <button
                onClick={() => setIsBudgetFirst(!isBudgetFirst)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isBudgetFirst
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>Budget-First Search</span>
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  showFilters
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none font-medium"
              >
                <option value="best_match">Sort: Best Match</option>
                <option value="followers_desc">Followers: High to Low</option>
                <option value="engagement_desc">Engagement: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Budget-First Slider Drawer */}
          {isBudgetFirst && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground">Total Campaign Budget: </span>
                  <span className="text-sm font-bold text-primary font-mono">
                    ₹{budgetAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Includes 10% platform fee and statutory GST
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>₹5,000</span>
                <span>₹50,000</span>
                <span>₹2,00,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>
          )}

          {/* Filter Popover Section */}
          {showFilters && (
            <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-150">
              {/* Platform */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Platform Channel</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs"
                >
                  <option value="all">All Channels</option>
                  <option value="instagram">Instagram Only</option>
                  <option value="youtube">YouTube Only</option>
                </select>
              </div>

              {/* Niche / Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Creator Niche</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs"
                >
                  <option value="">All Categories</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Tech">Technology</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Beauty">Beauty & Skincare</option>
                  <option value="Fitness">Fitness & Health</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food & Beverage</option>
                </select>
              </div>

              {/* Audience 18+ Share */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Min 18+ Audience Ratio</label>
                <select
                  value={min18PlusShare !== undefined ? String(min18PlusShare) : ''}
                  onChange={(e) =>
                    setMin18PlusShare(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs"
                >
                  <option value="">Any Audience Age</option>
                  <option value="70">At least 70% 18+</option>
                  <option value="80">At least 80% 18+</option>
                  <option value="90">At least 90% 18+</option>
                </select>
                <p className="text-[10px] text-muted-foreground">Excludes accounts without real demographic snapshots</p>
              </div>

              {/* Deliverable Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Deliverable Format</label>
                <select
                  value={deliverableFormat}
                  onChange={(e) => setDeliverableFormat(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs"
                >
                  <option value="ANY">Any Format</option>
                  <option value="REEL">Instagram Reels</option>
                  <option value="STORY">Instagram Stories</option>
                  <option value="POST">Static Post</option>
                  <option value="VIDEO">Dedicated Video</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing <span className="font-bold text-foreground">{creators.length}</span> verified creators on Adzunova
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OAuth Authenticated First-Party Metrics Only</span>
          </div>
        </div>

        {/* Creator Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground rounded-2xl border border-border bg-card">
            Executing discovery search against verified creator index...
          </div>
        ) : creators.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-border bg-card space-y-3">
            <svg
              className="w-8 h-8 text-muted-foreground mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3 className="text-sm font-semibold text-foreground">No Verified Creators Matched Filters</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Per Adzunova truth guarantees, demographic and audience quality filters exclude creators without real first-party snapshots. Try relaxing your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creators.map((c) => {
              const isComparing = selectedForCompare.some((x) => x.creatorId === c.creatorId);
              const isShortlisted = shortlistedIds.has(c.creatorId);

              return (
                <div
                  key={c.creatorId}
                  className={`rounded-2xl border bg-card p-5 space-y-4 flex flex-col justify-between transition-all hover:border-primary/40 ${
                    isComparing ? 'border-primary ring-1 ring-primary' : 'border-border'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Name, Handle, Channel Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {c.avatarUrl ? (
                          <img
                            src={c.avatarUrl}
                            alt={c.displayName}
                            className="w-12 h-12 rounded-2xl object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                            {c.displayName[0]?.toUpperCase() || 'C'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-foreground leading-snug">
                              {c.displayName}
                            </h3>
                            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">{c.handle}</div>
                        </div>
                      </div>

                      {/* Best Match Score Pill */}
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary shrink-0"
                        title={c.matchExplanation}
                      >
                        {c.matchScore}% Match
                      </span>
                    </div>

                    {/* Category & Verified Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                        {c.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                        {c.verifiedBadgeText}
                      </span>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl border border-border bg-muted/20 text-center">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Reach</div>
                        <div className="text-xs font-bold text-foreground font-mono mt-0.5">
                          {c.followersCount >= 1000
                            ? `${(c.followersCount / 1000).toFixed(2)}K`
                            : c.followersCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Engagement</div>
                        <div className="text-xs font-bold text-foreground font-mono mt-0.5">
                          {c.engagementRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting</div>
                        <div className="text-xs font-bold text-primary font-mono mt-0.5">
                          {c.startingPriceMinor
                            ? `₹${(c.startingPriceMinor / 100).toLocaleString('en-IN')}`
                            : 'On Request'}
                        </div>
                      </div>
                    </div>

                    {/* Audience Demographics Highlights */}
                    {c.audienceMetrics && c.audienceMetrics.share18Plus !== null ? (
                      <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                        <span>Top: {c.audienceMetrics.topCountry || 'India'}</span>
                        <span className="font-semibold text-foreground">
                          {c.audienceMetrics.share18Plus}% 18+ Audience
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground italic">
                        Demographics: Snapshot computing
                      </div>
                    )}

                    {/* Honest Meta Disclaimer */}
                    <div className="text-[10px] text-muted-foreground border-t border-border pt-2 flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span className="truncate">{c.dataAsOfText}</span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => toggleCompare(c)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Compare</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleShortlist(c.creatorId)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isShortlisted
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                        title={isShortlisted ? 'In Shortlist' : 'Add to Shortlist'}
                      >
                        <svg className="w-4 h-4" fill={isShortlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                        </svg>
                      </button>

                      <Link
                        href={`/c/${c.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Compare Dock (Appears when 1-4 creators selected) */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card border border-border shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {selectedForCompare.length} Selected to Compare
              </span>
              <div className="flex -space-x-2">
                {selectedForCompare.map((c) => (
                  <div
                    key={c.creatorId}
                    className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card"
                  >
                    {c.displayName[0]}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedForCompare([])}
                className="text-xs text-muted-foreground hover:text-foreground underline px-2"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Compare Side-by-Side
              </button>
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Matrix Modal */}
        {showCompareModal && comparisonMatrix && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  Side-by-Side Creator Comparison (Up to 4)
                </h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Comparison Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="py-3 px-4 text-muted-foreground font-semibold">Dimension</th>
                      {comparisonMatrix.creators.map((c) => (
                        <th key={c.creatorId} className="py-3 px-4 font-bold text-foreground text-center">
                          <div className="font-semibold">{c.displayName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{c.handle}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {comparisonMatrix.dimensions.map((dim) => (
                      <tr key={dim.key} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">{dim.label}</td>
                        {comparisonMatrix.creators.map((c) => (
                          <td key={c.creatorId} className="py-3 px-4 text-center font-mono text-muted-foreground">
                            {dim.values[c.creatorId]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrandPageContainer>
  );
}
