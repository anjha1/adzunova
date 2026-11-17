import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--color-surface-3)] text-[var(--color-fg-secondary)] border border-[var(--color-border)]',
  success:
    'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-200)]',
  warning:
    'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border border-[var(--color-warning-200)]',
  danger:
    'bg-[var(--color-error-50)] text-[var(--color-error-700)] border border-[var(--color-error-200)]',
  info:
    'bg-[var(--color-info-50)] text-[var(--color-info-700)] border border-[var(--color-info-200)]',
};

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Layout
        'inline-flex items-center',
        'rounded-[var(--radius-full)] px-2.5 py-0.5',
        // Typography
        'text-xs font-medium leading-none',
        // Transition
        'transition-colors duration-150',
        // Variant
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
