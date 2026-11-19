import React from 'react';
import Link from 'next/link';

interface PlaceholderProps {
  title: string;
  badge?: string;
  description: string;
  category: string;
}

export function CreatorModulePlaceholder({ title, badge = 'Workspace', description, category }: PlaceholderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold border border-indigo-500/20">
        ✦
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-muted text-muted-foreground mb-2">
        <span>{category}</span>
        <span>•</span>
        <span className="text-indigo-600 dark:text-indigo-400">{badge}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          href="/creator/dashboard"
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition"
        >
          ← Back to Dashboard
        </Link>
        <Link
          href="/creator/accounts"
          className="px-4 py-2 rounded-xl border border-border text-foreground font-semibold text-xs hover:bg-muted transition"
        >
          Manage Accounts
        </Link>
      </div>
    </div>
  );
}
