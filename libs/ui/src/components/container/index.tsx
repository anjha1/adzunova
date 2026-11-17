import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-[var(--width-sm)]',
  md: 'max-w-[var(--width-md)]',
  lg: 'max-w-[var(--width-lg)]',
  xl: 'max-w-[var(--width-xl)]',
  full: 'max-w-full',
};

export function Container({
  size = 'xl',
  as: Tag = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full',
        'px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
