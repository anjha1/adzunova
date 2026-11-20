'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [latest, setLatest] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [meRes, latestRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/creator/social-account-latest').catch(() => null),
        ]);

        if (meRes.ok) {
          const data = await meRes.json();
          const profile = data.profile || {};
          const user = data.user || {};
          const loaded = {
            displayName: profile.displayName || user.displayName || '',
            handle: profile.handle || user.email?.split('@')[0] || '',
            bio: profile.bio || '',
            location: profile.location || '',
            category: profile.category || '',
            avatarUrl: profile.avatarUrl || user.avatarUrl || null,
            isPublished: !!profile.isPublished,
          };
          setDisplayName(loaded.displayName);
          setHandle(loaded.handle);
          setBio(loaded.bio);
          setLocation(loaded.location);
          setCategory(loaded.category);
          setAvatarUrl(loaded.avatarUrl);
          setIsPublished(loaded.isPublished);
          setInitialData(loaded);
        }

        if (latestRes && latestRes.ok) {
          const lData = await latestRes.json();
          setLatest(lData);
          if (lData?.account?.username) {
            setInstagramUrl(`https://instagram.com/${lData.account.username}`);
          }
          if (!avatarUrl && lData?.account?.profilePictureUrl) {
            setAvatarUrl(lData.account.profilePictureUrl);
          }
        }
      } catch {
        // Fallback to blank form
      }
    }
    loadProfile();
  }, []);

  const handleChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setIsDirty(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setIsDirty(false);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const initialLetter = (displayName?.[0] || 'C').toUpperCase();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Public Profile & Media Card"
        description="Configure your marketplace storefront. Brands browse this profile to review verified audience analytics and book sponsorships."
        action={
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                <ShellIcon name="AlertCircle" size={12} />
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <ShellIcon name="Save" size={14} />
              {isSaved ? 'Profile Updated!' : 'Save Changes'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Left: Editor Form */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Profile Information</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPublished
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                : 'bg-muted text-muted-foreground border border-border'
            }`}>
              {isPublished ? 'Publicly visible' : 'Not published (Draft)'}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="Your creative name"
                  value={displayName}
                  onChange={(e) => handleChange(setDisplayName, e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Handle / Slug</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground">@</span>
                  <input
                    type="text"
                    placeholder="handle"
                    value={handle}
                    onChange={(e) => handleChange(setHandle, e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-7 pr-3 py-2 text-foreground font-mono focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Primary Niche Category</label>
                <select
                  value={category}
                  onChange={(e) => handleChange(setCategory, e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                >
                  <option value="">Select primary niche...</option>
                  <option value="Consumer Tech">Consumer Tech</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Finance & Crypto">Finance & Crypto</option>
                  <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => handleChange(setLocation, e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-foreground">Creator Bio / Pitch</label>
                <span className="text-[11px] text-muted-foreground">{bio.length} / 300</span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                placeholder="Tell brands what makes your audience and content format unique..."
                value={bio}
                onChange={(e) => handleChange(setBio, e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground leading-relaxed focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 border-t border-border space-y-3">
              <span className="font-bold text-foreground block">Channel &amp; Social Portfolio Links</span>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted-foreground">Instagram Profile URL</label>
                  {latest?.hasConnectedAccount && (
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                      Verified via Instagram API
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  readOnly={!!latest?.hasConnectedAccount}
                  placeholder="https://instagram.com/profile"
                  value={instagramUrl}
                  onChange={(e) => handleChange(setInstagramUrl, e.target.value)}
                  className={`w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono ${
                    latest?.hasConnectedAccount ? 'opacity-80 bg-muted/40 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted-foreground">YouTube Channel URL</label>
                  <span className="text-[10px] text-muted-foreground">Connect YouTube in Accounts to link</span>
                </div>
                <input
                  type="text"
                  disabled
                  placeholder="Connect YouTube in Accounts to link"
                  value={youtubeUrl}
                  onChange={(e) => handleChange(setYoutubeUrl, e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-muted-foreground font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Live Public Card Preview</h3>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`px-2.5 py-1 rounded-md transition ${
                  previewMode === 'desktop' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`px-2.5 py-1 rounded-md transition ${
                  previewMode === 'mobile' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Rendered Preview Card */}
          <div
            className={`mx-auto rounded-2xl border border-border bg-background overflow-hidden shadow-xs transition-all ${
              previewMode === 'mobile' ? 'max-w-xs p-4' : 'w-full p-6'
            }`}
          >
            <div className="flex items-start gap-4">
              {avatarUrl ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt={displayName || 'Avatar'} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {initialLetter}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">{displayName || 'Creator'}</h4>
                  <StatusBadge
                    variant={latest?.hasConnectedAccount ? 'success' : 'neutral'}
                    label={latest?.hasConnectedAccount ? 'Verified Creator' : 'Unverified'}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground">@{handle || 'handle'}</span>
                {category && (
                  <span className="block text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {category} {location ? `• ${location}` : ''}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              {bio || 'No bio entered yet. Complete your profile details on the left.'}
            </p>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Verified Reach: {latest?.hasConnectedAccount ? `${Number(latest.totalReach || 0).toLocaleString()} followers` : '— (Not connected)'}
              </span>
              <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-medium text-xs">
                Book Sponsorship
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
