'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function GrowthPage() {
  const [targetIndustry, setTargetIndustry] = useState('Consumer Tech & Hardware');
  const [pitchText, setPitchText] = useState(
    'Hi team! I create focused content in the technology space. I would love to collaborate with your brand on an authentic product feature. View my verified rate card and availability on Adzunova.'
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Growth & Optimization"
        description="Profile completeness guidance, audience analytics readiness, and brand pitch templates."
      />

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Profile Completeness"
          value="—"
          subValue="Connect accounts to calculate"
          icon={<ShellIcon name="Award" size={16} />}
        />
        <StatCard
          label="Recommended Rate Lift"
          value="—"
          subValue="Not enough deal data"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Audience Quality Tier"
          value="—"
          subValue="Pending social account sync"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Profile Strength & Actions */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Profile Readiness Checklist</h3>
            <span className="text-xs font-bold text-muted-foreground">Setup in progress</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border">
              <div className="flex items-center gap-2 text-foreground">
                <ShellIcon name="AlertCircle" size={14} className="text-amber-500" />
                <span>Connect your primary Instagram or YouTube account</span>
              </div>
              <Link href="/creator/accounts" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Connect →
              </Link>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border">
              <div className="flex items-center gap-2 text-foreground">
                <ShellIcon name="AlertCircle" size={14} className="text-amber-500" />
                <span>Set your deliverable rate card pricing</span>
              </div>
              <Link href="/creator/rate-card" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Configure →
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Pitch Assistant */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <ShellIcon name="Sparkles" size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-foreground">Brand Pitch Template</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
              Standard Template
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Target Brand Niche</label>
              <select
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="Consumer Tech & Hardware">Consumer Tech & Hardware</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Fintech & Apps">Fintech & Apps</option>
                <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Pitch Copy</label>
              <textarea
                rows={4}
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 text-foreground leading-relaxed focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <ShellIcon name="Copy" size={13} />
                {copied ? 'Copied to Clipboard!' : 'Copy Pitch'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
