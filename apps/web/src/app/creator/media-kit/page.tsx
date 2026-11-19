'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function MediaKitPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://adzunova.com/@creator/media-kit');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Automated Verified Media Kit"
        description="Always-up-to-date, live media kit backed by verified platform data. Send this single link to brands to bypass agency back-and-forth."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting high-resolution 300 DPI PDF Media Kit...')}
              className="px-3.5 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted font-medium flex items-center gap-1.5"
            >
              <ShellIcon name="Download" size={14} />
              Export PDF
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <ShellIcon name="Share2" size={14} />
              {copied ? 'Copied Public Link!' : 'Share Live Media Kit'}
            </button>
          </div>
        }
      />

      {/* Media Kit Preview Sheet */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-card border border-border shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="h-36 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 flex items-end">
          <span className="text-xs font-bold text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
            ADZUNOVA VERIFIED MEDIA KIT • UPDATED DAILY
          </span>
        </div>

        <div className="px-8 pb-8 pt-0 space-y-6">
          {/* Profile Overview */}
          <div className="flex flex-col desk:flex-row desk:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-card flex items-center justify-center text-white text-2xl font-black shadow-lg">
                AC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-foreground">Achhuta Creative</h2>
                  <StatusBadge variant="success" label="Verified Pro Creator" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  @achhutacreative • Consumer Tech, AI Hardware & Mobile Reviews
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">📍 Mumbai, India</span>
              <span className="text-xs font-semibold text-muted-foreground">🗣️ English, Hindi</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            Award-winning consumer technology reviews focusing on flagship smartphones, creator audio setups, and developer productivity machines. Audience consists of high-intent engineers, founders, and creative professionals.
          </p>

          {/* Verified Stats Highlight */}
          <div className="grid grid-cols-2 desk:grid-cols-4 gap-4 p-5 rounded-2xl bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Verified Reach</span>
              <p className="text-lg font-black text-foreground">482,500+</p>
              <span className="text-[10px] text-muted-foreground">YouTube & Instagram</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Engagement Rate</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">4.92%</p>
              <span className="text-[10px] text-muted-foreground">2.2x niche benchmark</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Audience Score</span>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">94 / 100</p>
              <span className="text-[10px] text-muted-foreground">Audience authenticity</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Avg Monthly Views</span>
              <p className="text-lg font-black text-foreground">1,240,000</p>
              <span className="text-[10px] text-muted-foreground">Across all videos</span>
            </div>
          </div>

          {/* Core Audience Split */}
          <div className="grid grid-cols-1 desk:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
              <span className="font-bold text-foreground block">Age Demographics</span>
              <p className="text-muted-foreground">18-34 years makes up <strong>80%</strong> of the audience.</p>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted mt-2">
                <div style={{ width: '42%' }} className="bg-indigo-600" title="18-24: 42%" />
                <div style={{ width: '38%' }} className="bg-indigo-400" title="25-34: 38%" />
                <div style={{ width: '20%' }} className="bg-indigo-200" title="35+: 20%" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
              <span className="font-bold text-foreground block">Geography Focus</span>
              <p className="text-muted-foreground">Top regions: India (64%), United States (18%), UK (9%).</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium text-foreground">
                  🇮🇳 Tier 1 Metros
                </span>
                <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium text-foreground">
                  🇺🇸 Tech Hubs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
