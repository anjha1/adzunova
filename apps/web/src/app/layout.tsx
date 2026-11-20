import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/theme/theme-provider';
import './globals.css';

// ---------------------------------------------------------------------------
// Fonts — self-hosted via next/font/local
// Fonts are served from public/fonts/ — no external network requests.
// Files are copies of the Geist fonts bundled in Next.js itself.
// ---------------------------------------------------------------------------
const geistSans = localFont({
  src: [
    {
      path: '../../public/fonts/geist-latin.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/geist-latin-ext.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

const geistMono = localFont({
  src: [
    {
      path: '../../public/fonts/geist-mono-latin.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/geist-mono-latin-ext.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: 'Adzunova — Global Creator & Brand Collaboration Marketplace',
    template: '%s | Adzunova',
  },
  description:
    'Adzunova connects creators, influencers, actors, and brands worldwide. Launch campaigns, discover talent, and build lasting partnerships on the leading collaboration marketplace.',
  metadataBase: new URL('https://adzunova.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adzunova.com',
    siteName: 'Adzunova',
    title: 'Adzunova — Global Creator & Brand Collaboration Marketplace',
    description:
      'Connect creators and brands worldwide. Launch campaigns, discover talent, and build lasting partnerships.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@adzunova',
    creator: '@adzunova',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

// ---------------------------------------------------------------------------
// Theme anti-flash script
// Implements the Next.js 16 inline script pattern from:
//   node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
//
// This runs synchronously during HTML parsing, before the first paint.
// It reads localStorage (and falls back to system preference) then sets
// data-theme on <html> so CSS variables resolve correctly on first render.
// suppressHydrationWarning on <html> tells React to accept the DOM as-is.
// ---------------------------------------------------------------------------
const themeScript = `(function(){
  try {
    var stored = localStorage.getItem('adzunova-theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
      return;
    }
    // Fall back to OS preference
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } catch (e) {
    // localStorage unavailable — leave default data-theme="light" in place
  }
})();`;

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      // Default server-side theme — the inline script will override this
      // before first paint when JS is available.
      data-theme="light"
      // Required to suppress React's hydration mismatch warning when the
      // inline script changes the attribute before React hydrates.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/*
         * Theme script — must run before <body> so CSS variables resolve
         * correctly on first paint. The try/catch handles SSR + no-JS envs.
         */}
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg-base)] text-[var(--color-fg-primary)] antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
