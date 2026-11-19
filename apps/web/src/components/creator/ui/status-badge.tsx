import React from 'react';

export type StatusVariant =
  | 'DRAFT'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'ACTIVE';

interface StatusBadgeProps {
  status?: StatusVariant | string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | string;
  label?: string;
}

export function StatusBadge({ status, variant, label }: StatusBadgeProps) {
  const norm = ((status || variant || '') as string).toUpperCase();
  const displayLabel = label || norm.replace(/_/g, ' ');

  let classes = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  if (norm === 'COMPLETED' || norm === 'VERIFIED' || norm === 'ACTIVE' || norm === 'SUCCESS') {
    classes = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
  } else if (norm === 'PENDING' || norm === 'IN_PROGRESS' || norm === 'WARNING') {
    classes = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
  } else if (norm === 'CANCELLED' || norm === 'REJECTED' || norm === 'DANGER') {
    classes = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
  } else if (norm === 'INFO') {
    classes = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
  } else if (norm === 'UNVERIFIED' || norm === 'NEUTRAL' || norm === 'DRAFT') {
    classes = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${classes}`}>
      {displayLabel}
    </span>
  );
}
