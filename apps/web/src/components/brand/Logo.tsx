import React from 'react';
import Link from 'next/link';

export type LogoVariant = 'full' | 'mark' | 'icon' | 'compact';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LogoTheme = 'auto' | 'light' | 'dark';

export interface LogoProps {
  /** Variant of the logo to render */
  variant?: LogoVariant;
  /** Size preset or custom pixel number */
  size?: LogoSize | number;
  /** Theme mode for logo icon rendering */
  theme?: LogoTheme;
  /** Custom destination url (or false to render non-interactive container) */
  href?: string | false;
  /** Additional custom classes on the root element */
  className?: string;
  /** Additional custom classes on the image mark */
  imageClassName?: string;
  /** Optional badge text next to the wordmark (e.g. "CREATOR", "BRAND") */
  badgeText?: string;
  /** Custom accessible label */
  ariaLabel?: string;
  /** Priority loading for above-the-fold headers */
  priority?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

const SIZE_MAP: Record<LogoSize, { px: number; textClass: string; gapClass: string }> = {
  xs: { px: 20, textClass: 'text-sm font-bold', gapClass: 'gap-1.5' },
  sm: { px: 24, textClass: 'text-base font-bold', gapClass: 'gap-2' },
  md: { px: 32, textClass: 'text-xl font-extrabold', gapClass: 'gap-2.5' },
  lg: { px: 40, textClass: 'text-2xl font-black', gapClass: 'gap-3' },
  xl: { px: 48, textClass: 'text-3xl font-black', gapClass: 'gap-3.5' },
};

export function Logo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  href = '/',
  className = '',
  imageClassName = '',
  badgeText,
  ariaLabel = 'Adzunova home',
  priority = true,
  onClick,
}: LogoProps) {
  // Determine pixel size and font styles
  const sizeConfig = typeof size === 'number'
    ? {
        px: size,
        textClass: size >= 40 ? 'text-2xl font-black' : size >= 28 ? 'text-xl font-extrabold' : 'text-base font-bold',
        gapClass: size >= 32 ? 'gap-2.5' : 'gap-2',
      }
    : SIZE_MAP[size] || SIZE_MAP.md;

  const pixelSize = sizeConfig.px;

  // Render Theme-Aware Image Elements
  const renderLogoImage = () => {
    // Standard dark logo (for light backgrounds)
    const lightBgLogo = (
      <img
        src="/favicon/logo/android-chrome-192x192.png"
        alt="Adzunova"
        width={pixelSize}
        height={pixelSize}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`object-contain shrink-0 ${imageClassName} ${
          theme === 'auto' ? 'dark:hidden block' : theme === 'dark' ? 'hidden' : 'block'
        }`}
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      />
    );

    // White/light logo (for dark backgrounds)
    const darkBgLogo = (
      <img
        src="/favicon/logo/android-chrome-w-192x192.png"
        alt="Adzunova"
        width={pixelSize}
        height={pixelSize}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`object-contain shrink-0 ${imageClassName} ${
          theme === 'auto' ? 'hidden dark:block' : theme === 'light' ? 'hidden' : 'block'
        }`}
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      />
    );

    return (
      <span className="relative inline-flex items-center justify-center shrink-0">
        {lightBgLogo}
        {darkBgLogo}
      </span>
    );
  };

  const isIconOnly = variant === 'mark' || variant === 'icon';

  const content = (
    <span className={`inline-flex items-center ${sizeConfig.gapClass} select-none ${className}`}>
      <span className="sr-only">Adzunova</span>

      {/* Official Logo Symbol */}
      {renderLogoImage()}

      {/* Wordmark (unless icon-only) */}
      {!isIconOnly && (
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`flex items-baseline leading-none tracking-tight ${sizeConfig.textClass}`}
          >
            {/* "Adz" with gradient brand accent */}
            <span
              style={{
                background: 'var(--gradient-brand, linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              className="tracking-tight"
            >
              Adz
            </span>
            {/* "unova" foreground text */}
            <span className="text-[var(--color-fg-primary,currentColor)] font-bold tracking-tight">
              unova
            </span>
          </span>

          {/* Optional Badge (e.g. CREATOR or BRAND) */}
          {badgeText && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              {badgeText}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href === false) {
    return (
      <span onClick={onClick} className="cursor-pointer">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg transition-opacity hover:opacity-90"
    >
      {content}
    </Link>
  );
}

export default Logo;
