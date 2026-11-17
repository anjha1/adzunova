import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';

export type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]',
  elevated:
    'bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[var(--shadow-md)]',
  interactive: [
    'bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]',
    'cursor-pointer transition-all duration-150',
    'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-strong)]',
    'active:shadow-[var(--shadow-sm)] active:scale-[0.995]',
  ].join(' '),
};

export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] overflow-hidden',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-tight tracking-tight',
        'text-[var(--color-fg-primary)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-[var(--color-fg-muted)]', className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center px-6 py-4',
        'border-t border-[var(--color-border)]',
        'bg-[var(--color-surface-2)]',
        className,
      )}
      {...props}
    />
  );
}
