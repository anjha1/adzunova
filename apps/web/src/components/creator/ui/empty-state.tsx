import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  secondaryActionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  secondaryActionText,
  secondaryActionHref,
}: EmptyStateProps) {
  return (
    <div className="p-8 desk:p-12 text-center rounded-3xl border border-dashed border-border bg-card/60">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        {icon || '✦'}
      </div>
      <h3 className="text-base font-bold text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-xs desk:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionText && actionHref && (
            <Link
              href={actionHref}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs desk:text-sm shadow-xs transition"
            >
              {actionText}
            </Link>
          )}
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs desk:text-sm shadow-xs transition"
            >
              {actionText}
            </button>
          )}
          {secondaryActionText && secondaryActionHref && (
            <Link
              href={secondaryActionHref}
              className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-xs desk:text-sm transition"
            >
              {secondaryActionText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
