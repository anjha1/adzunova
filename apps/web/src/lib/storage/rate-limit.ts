import { NextRequest } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Bucket>();

export interface RateLimitCheck {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkStorageRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): RateLimitCheck {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    if (windows.size > 10_000) {
      for (const [k, v] of windows.entries()) {
        if (v.resetAt <= now) windows.delete(k);
      }
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function extractClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export function getUserStorageQuotaBytes(env: Record<string, string | undefined> = process.env): bigint {
  // No plan-level storage quota table exists in the codebase yet; use env default (1 GB).
  const raw = env.STORAGE_USER_QUOTA_BYTES || String(1024 * 1024 * 1024);
  try {
    return BigInt(raw);
  } catch {
    return BigInt(1024 * 1024 * 1024);
  }
}
