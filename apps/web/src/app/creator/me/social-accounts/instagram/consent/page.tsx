import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

export default function InstagramConsentPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Connect Instagram Professional Account"
        description="Review transparency, data usage, and privacy safeguards before proceeding to Meta Login."
      />

      {/* Main Consent Card */}
      <div className="bg-card border border-border rounded-3xl p-6 desk:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-border">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShellIcon name="Sparkles" size={24} />
          </div>
          <div>
            <h2 className="text-base desk:text-lg font-bold text-foreground">
              Official Meta Graph API Integration
            </h2>
            <p className="text-xs text-muted-foreground">
              Facebook Login for Business &bull; OAuth 2.0 Unified Flow
            </p>
          </div>
        </div>

        {/* What We Read */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <ShellIcon name="CheckCircle" size={16} />
            <span>What Adzunova Will Access</span>
          </div>
          <ul className="space-y-2 text-xs desk:text-sm text-muted-foreground pl-1">
            <li className="flex items-start gap-2">
              <span className="text-foreground font-bold">&bull;</span>
              <span><strong>Public Profile Metrics:</strong> Username, profile photo, follower count, and published post count.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground font-bold">&bull;</span>
              <span><strong>24-Hour Views Total Value:</strong> Daily aggregate impressions used to verify active audience reach.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground font-bold">&bull;</span>
              <span><strong>Macro Demographics:</strong> Aggregated age distribution (7 standard brackets), gender ratios, and top country shares.</span>
            </li>
          </ul>
        </div>

        {/* What We Never Read */}
        <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <ShellIcon name="AlertCircle" size={16} />
            <span>Strict Privacy Safeguards (What We Never Access)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>&bull; No access to Direct Messages (DMs) or private chats.</li>
            <li>&bull; No access to private drafts, passwords, or browsing activity.</li>
            <li>&bull; No access to individual follower usernames or personal contact info.</li>
            <li>&bull; We never post, publish, comment, or modify anything on your account.</li>
          </ul>
        </div>

        {/* Purpose & Retention */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Why:</strong> Verified audience reach enables brands to send sponsored campaign offers directly to your rate card without manual screenshot verification.
          </p>
          <p>
            <strong className="text-foreground">Retention:</strong> OAuth access tokens are envelope-encrypted using AES-256-GCM and purged immediately if you disconnect your account or revoke permissions via Facebook settings.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border flex flex-col desk:flex-row gap-3">
          <Link
            href="/creator/me/social-accounts/instagram/connect"
            className="flex-1 py-3 px-5 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs desk:text-sm shadow-xs transition"
          >
            I Understand &bull; Proceed to Meta Login →
          </Link>
          <Link
            href="/creator/accounts"
            className="py-3 px-5 text-center rounded-xl border border-border hover:bg-muted text-foreground font-bold text-xs desk:text-sm transition"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
