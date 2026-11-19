'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader, StatCard, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function GrowthPage() {
  const [targetIndustry, setTargetIndustry] = useState('Consumer Tech & SaaS');
  const [pitchText, setPitchText] = useState(
    'Hi team! I produce high-retention deep dives on consumer tech with a 4.9% engagement rate across 480K verified followers. With 64% of my audience in Tier 1 metros making active purchase decisions, a dedicated review will drive high-intent trial conversions for your launch. Let’s collaborate through verified Adzunova escrow.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGeneratePitch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPitchText(
        `Hello ${targetIndustry} team! My channel reaches 480K+ highly engaged consumers looking for trusted reviews in the ${targetIndustry} category. With our 94/100 Audience Quality Score, we convert viewers into paying customers. Check out our verified rate card and portfolio on Adzunova.`
      );
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Growth & AI Intelligence"
        description="Machine learning optimizations for rate card pricing, algorithmic profile recommendations, and AI-assisted brand pitching."
      />

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Profile Strength"
          value="85%"
          subValue="2 actions to reach 100%"
          icon={<ShellIcon name="Award" size={16} />}
        />
        <StatCard
          label="Recommended Rate Lift"
          value="+15% Base"
          subValue="Based on 4.9% engagement"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Audience Quality Tier"
          value="Tier 1 (Top 5%)"
          subValue="High brand matchability"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Profile Strength & Actions */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Profile Completeness & Readiness</h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">85% Complete</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: '85%' }} />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShellIcon name="CheckCircle" size={14} className="text-emerald-500" />
              <span>Identity & KYC verified</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShellIcon name="CheckCircle" size={14} className="text-emerald-500" />
              <span>YouTube Channel OAuth connected</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShellIcon name="CheckCircle" size={14} className="text-emerald-500" />
              <span>Standard Rate Card configured</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <ShellIcon name="AlertCircle" size={14} />
                <span>Add 2 more portfolio showcase links</span>
              </div>
              <Link href="/creator/profile" className="font-bold underline">
                Add Now
              </Link>
            </div>
          </div>
        </div>

        {/* AI Pitch Generator */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <ShellIcon name="Sparkles" size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-foreground">AI Brand Pitch Assistant</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              GPT-4o Fine-Tuned
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
                <option value="Consumer Tech & SaaS">Consumer Tech & SaaS</option>
                <option value="Fitness & Health Supplements">Fitness & Health Supplements</option>
                <option value="Fintech & Investment Apps">Fintech & Investment Apps</option>
                <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Tailored Pitch Draft</label>
              <textarea
                rows={4}
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 text-foreground leading-relaxed focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleGeneratePitch}
                disabled={isGenerating}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted font-medium flex items-center gap-1.5"
              >
                <ShellIcon name="RefreshCw" size={13} className={isGenerating ? 'animate-spin' : ''} />
                Regenerate AI Pitch
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
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
