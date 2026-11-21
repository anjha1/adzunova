import React from 'react';
import Link from 'next/link';
import { BrandShellIcon } from './brand-shell-icons';

interface BrandPageContainerProps {
  title: string;
  category: string;
  description: string;
  iconName: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function BrandPageContainer({
  title,
  category,
  description,
  iconName,
  actions,
  children,
}: BrandPageContainerProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <Link href="/brand/dashboard" className="hover:text-foreground transition">
              Brand
            </Link>
            <span>/</span>
            <span className="text-primary">{category}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BrandShellIcon name={iconName} size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Main Body */}
      {children}
    </div>
  );
}

interface BrandEmptyStateProps {
  title: string;
  description: string;
  iconName: string;
  actionLabel?: string;
  actionHref?: string;
}

export function BrandEmptyState({
  title,
  description,
  iconName,
  actionLabel,
  actionHref,
}: BrandEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
        <BrandShellIcon name={iconName} size={24} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-2xs"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
