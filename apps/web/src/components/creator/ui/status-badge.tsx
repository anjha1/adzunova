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

  let classes = 'bg-muted text-muted-foreground border border-border';

  if (norm === 'COMPLETED' || norm === 'VERIFIED' || norm === 'ACTIVE' || norm === 'SUCCESS') {
    classes = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
  } else if (norm === 'PENDING' || norm === 'IN_PROGRESS' || norm === 'WARNING') {
    classes = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
  } else if (norm === 'CANCELLED' || norm === 'REJECTED' || norm === 'DANGER') {
    classes = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
  } else if (norm === 'INFO') {
    classes = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
  } else if (norm === 'UNVERIFIED' || norm === 'NEUTRAL' || norm === 'DRAFT') {
    classes = 'bg-muted text-muted-foreground border border-border';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${classes}`}>
      {displayLabel}
    </span>
  );
}
