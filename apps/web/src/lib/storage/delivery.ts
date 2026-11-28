import type { ObjectStoragePort } from './port';

export const HARD_MAX_PRESIGN_GET_TTL_SECONDS = 900; // 15 minutes hard ceiling

/**
 * Builds an immutable public CDN URL from NEXT_PUBLIC_CDN_BASE.
 * Refuses r2.dev domains and refuses private/ingest/exports keys.
 */
export function buildPublicCdnUrl(
  objectKey: string,
  cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || ''
): string {
  const base = cdnBase.trim().replace(/\/+$/, '');
  if (!base || !base.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_CDN_BASE must be an https:// custom domain');
  }
  if (/\.r2\.dev\b/i.test(base)) {
    throw new Error('r2.dev URLs are strictly forbidden in production delivery');
  }
  if (!objectKey.startsWith('public/')) {
    throw new Error('Only public/* object keys may be delivered via public CDN');
  }
  return `${base}/${objectKey}`;
}

/**
 * Issues a strictly TTL-bounded presigned GET URL for private/export objects.
 */
export async function issueBoundedPresignedGet(
  port: Pick<ObjectStoragePort, 'presignGet'>,
  bucket: string,
  key: string,
  requestedTtlSeconds?: number
): Promise<string> {
  if (key.startsWith('public/')) {
    throw new Error('Public objects must use CDN delivery, not presigned GET');
  }
  const configuredMax = Number(process.env.R2_DOWNLOAD_URL_EXPIRY || HARD_MAX_PRESIGN_GET_TTL_SECONDS);
  const ceiling = Math.min(configuredMax, HARD_MAX_PRESIGN_GET_TTL_SECONDS);
  const ttl = Math.max(1, Math.min(requestedTtlSeconds ?? ceiling, ceiling));
  return port.presignGet(bucket, key, ttl);
}
