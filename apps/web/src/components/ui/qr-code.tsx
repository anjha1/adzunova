'use client';

import React, { useMemo } from 'react';
import { generateQrMatrix, EccLevel } from '@/lib/qr/qr-generator';

export interface QrCodeProps {
  value: string;
  size?: number;
  centerLogo?: boolean;
  logoUrl?: string;
  className?: string;
  eccLevel?: EccLevel;
}

export function QrCode({
  value,
  size = 160,
  centerLogo = true,
  logoUrl = '/favicon/logo/android-chrome-192x192.png',
  className = '',
  eccLevel = 'Q',
}: QrCodeProps) {
  const qr = useMemo(() => {
    if (!value) return null;
    try {
      // Use ECL 'Q' (25% error correction) when center logo is embedded
      return generateQrMatrix(value, centerLogo ? 'Q' : eccLevel);
    } catch (err) {
      console.error('[QrCode] Generation error:', err);
      return null;
    }
  }, [value, centerLogo, eccLevel]);

  if (!qr) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-muted/40 rounded-2xl border border-border text-xs text-muted-foreground ${className}`}
      >
        <span>Invalid QR Data</span>
      </div>
    );
  }

  const { matrix, size: matrixSize } = qr;
  const margin = 2; // modules
  const totalDim = matrixSize + margin * 2;

  // Center logo dimensions (in QR module units)
  // ~22% of matrix size is well within ECL 'Q' (25% recovery)
  const logoModules = centerLogo ? Math.max(5, Math.floor(matrixSize * 0.22)) : 0;
  const logoStart = (totalDim - logoModules) / 2;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-xs border border-border overflow-hidden select-none ${className}`}
      aria-label={`QR Code linking to ${value}`}
    >
      <svg
        viewBox={`0 0 ${totalDim} ${totalDim}`}
        className="w-full h-full shape-rendering-crispEdges"
        shapeRendering="crispEdges"
      >
        {/* Crisp white background */}
        <rect width={totalDim} height={totalDim} fill="#ffffff" />

        {/* Dark QR Modules */}
        {matrix.map((row, r) =>
          row.map((isDark, c) => {
            if (!isDark) return null;

            // If center logo is present, skip rendering modules directly beneath logo card to keep it clean
            if (centerLogo) {
              const mr = r + margin;
              const mc = c + margin;
              if (
                mr >= logoStart &&
                mr < logoStart + logoModules &&
                mc >= logoStart &&
                mc < logoStart + logoModules
              ) {
                return null;
              }
            }

            return (
              <rect
                key={`${r}-${c}`}
                x={c + margin}
                y={r + margin}
                width={1}
                height={1}
                fill="#0F172A"
              />
            );
          })
        )}

        {/* Center Adzunova Brand Logo */}
        {centerLogo && (
          <g>
            {/* White Card Mask with rounded corners */}
            <rect
              x={logoStart}
              y={logoStart}
              width={logoModules}
              height={logoModules}
              rx={1}
              fill="#ffffff"
              stroke="#E2E8F0"
              strokeWidth={0.2}
            />

            {/* Logo Image */}
            <image
              href={logoUrl}
              x={logoStart + 0.5}
              y={logoStart + 0.5}
              width={logoModules - 1}
              height={logoModules - 1}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
