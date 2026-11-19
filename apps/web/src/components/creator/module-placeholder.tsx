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
      <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold border border-indigo-200 dark:border-indigo-800">
        ✦
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-2">
        <span>{category}</span>
        <span>•</span>
        <span className="text-indigo-600 dark:text-indigo-400">{badge}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          href="/creator/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow hover:opacity-90 transition"
        >
          ← Back to Dashboard
        </Link>
        <Link
          href="/creator/accounts"
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Manage Accounts
        </Link>
      </div>
    </div>
  );
}
