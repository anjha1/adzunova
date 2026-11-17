'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--color-brand-600)] text-white shadow-sm',
    'hover:bg-[var(--color-brand-700)]',
    'active:bg-[var(--color-brand-800)]',
    'focus-visible:ring-[var(--color-brand-500)]',
  ].join(' '),
  secondary: [
    'bg-[var(--color-surface-2)] text-[var(--color-fg-primary)] shadow-sm',
    'border border-[var(--color-border)]',
    'hover:bg-[var(--color-surface-3)]',
    'focus-visible:ring-[var(--color-brand-500)]',
  ].join(' '),
  outline: [
    'border border-[var(--color-brand-600)] text-[var(--color-brand-600)] bg-transparent',
    'hover:bg-[var(--color-brand-50)]',
    'active:bg-[var(--color-brand-100)]',
    'focus-visible:ring-[var(--color-brand-500)]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--color-fg-secondary)]',
    'hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg-primary)]',
    'active:bg-[var(--color-surface-3)]',
    'focus-visible:ring-[var(--color-brand-500)]',
  ].join(' '),
  destructive: [
    'bg-[var(--color-error-600)] text-white shadow-sm',
    'hover:bg-[var(--color-error-700)]',
    'active:bg-[var(--color-error-800)]',
    'focus-visible:ring-[var(--color-error-500)]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-10 w-10 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled ?? isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          // Base layout
          'inline-flex items-center justify-center',
          'rounded-[var(--radius-md)] font-medium',
          // Transitions
          'transition-colors duration-150',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          // Disabled
          'disabled:pointer-events-none disabled:opacity-50',
          // Typography
          'select-none whitespace-nowrap leading-none',
          // Variant
          variantClasses[variant],
          // Size
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden="true"
            className={cn(
              'shrink-0 animate-spin rounded-full',
              'border-2 border-current border-t-transparent',
              size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
            )}
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
