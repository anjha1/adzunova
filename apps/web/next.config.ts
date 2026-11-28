
import type { NextConfig } from "next";
import path from "node:path";

function extractOrigin(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl.trim()).origin;
  } catch {
    return null;
  }
}

const r2Origins = Array.from(
  new Set(
    [extractOrigin(process.env.R2_ENDPOINT), extractOrigin(process.env.R2_DEV_ENDPOINT)].filter(Boolean)
  )
).join(' ');

const cdnOrigin =
  extractOrigin(process.env.NEXT_PUBLIC_CDN_BASE) ||
  extractOrigin(process.env.NEXT_PUBLIC_DEV_CDN_BASE) ||
  '';

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.cdninstagram.com https://*.fbcdn.net ${cdnOrigin}`.trim(),
  `media-src 'self' blob: ${cdnOrigin}`.trim(),
  `connect-src 'self' ${r2Origins}`.trim(),
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: [
    '@adzunova/storage-db',
    '@adzunova/payments-db',
    '@adzunova/money',
    '@adzunova/problem-details',
  ],
  serverExternalPackages: ['sharp', 'mongodb'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  turbopack: {
    root: path.resolve(process.cwd(), "../.."),

    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
