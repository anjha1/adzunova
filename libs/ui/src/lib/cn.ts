/**
 * Utility to merge class names conditionally.
 * Lightweight replacement for clsx — no extra dependencies needed.
 */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(' ');
}
