'use client';

import React, { useState } from 'react';
import { PageHeader, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('Achhuta Creative');
  const [handle, setHandle] = useState('achhutacreative');
  const [category, setCategory] = useState('Consumer Tech');
  const [location, setLocation] = useState('Mumbai, India');
  const [languages, setLanguages] = useState('English, Hindi');
  const [bio, setBio] = useState(
    'Award-winning tech reviewer and digital creator. Focused on flagship smartphone camera tests, developer workstation setups, and clean audio hardware.'
  );
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com/@achhutacreative');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/achhutacreative');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Public Profile & Media Card"
        description="Configure your marketplace storefront. Brands browse this profile to review verified audience analytics and book sponsorships."
        action={
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ShellIcon name="Save" size={14} />
            {isSaved ? 'Profile Updated!' : 'Save Changes'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Left: Editor Form */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Profile Information</h2>
            <span className="text-xs text-muted-foreground">Publicly visible</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Handle / Slug</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
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
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                >
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground leading-relaxed focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 border-t border-border space-y-3">
              <span className="font-bold text-foreground block">Channel & Social Portfolio Links</span>

              <div>
                <label className="text-muted-foreground block mb-1">YouTube Channel URL</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Instagram Profile URL</label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
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
            className={`mx-auto rounded-2xl border border-border bg-background overflow-hidden shadow-md transition-all ${
              previewMode === 'mobile' ? 'max-w-xs p-4' : 'w-full p-6'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {displayName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">{displayName}</h4>
                  <StatusBadge variant="success" label="Verified" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">@{handle}</span>
                <span className="block text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {category} • {location}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{bio}</p>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Verified Reach: 482K</span>
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
