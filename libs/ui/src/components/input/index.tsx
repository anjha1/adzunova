'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, helperText, error, id, className, disabled, ...props },
    ref,
  ) => {
    // Derive a stable ID from the label when no explicit id is given
    const resolvedId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={resolvedId}
            className={cn(
              'text-sm font-medium select-none',
              'text-[var(--color-fg-primary)]',
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={resolvedId}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            error
              ? `${resolvedId}-error`
              : helperText
                ? `${resolvedId}-helper`
                : undefined
          }
          className={cn(
            // Base
            'flex h-10 w-full px-3 py-2',
            'rounded-[var(--radius-md)]',
            'text-sm text-[var(--color-fg-primary)]',
            'bg-[var(--color-surface-1)]',
            'border border-[var(--color-border)]',
            'placeholder:text-[var(--color-fg-placeholder)]',
            // Transition
            'transition-colors duration-150',
            // Focus
            'outline-none',
            'focus:border-[var(--color-brand-500)]',
            'focus:ring-2 focus:ring-[var(--color-brand-200)]',
            // Error state
            hasError &&
              'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-200)]',
            // Disabled
            'disabled:cursor-not-allowed disabled:opacity-50',
            'disabled:bg-[var(--color-surface-2)]',
            className,
          )}
          {...props}
        />

        {error && (
          <p
            id={`${resolvedId}-error`}
            role="alert"
            className="text-xs font-medium text-[var(--color-error-600)]"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${resolvedId}-helper`}
            className="text-xs text-[var(--color-fg-muted)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
