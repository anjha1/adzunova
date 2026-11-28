import { assertDevBucketPrefix } from './env';
import { R2S3Adapter, enforceRolePermission, type ObjectStoragePort } from './port';
import type { StorageRole } from './resilience';

export interface ResolvedBuckets {
  public: string;
  private: string;
  quarantine: string;
  exports: string;
}

export interface StorageRuntimeResolution {
  configured: boolean;
  reason?: string;
  endpoint?: string;
  cdnBase?: string;
  buckets?: ResolvedBuckets;
  isDevTarget?: boolean;
}

function getRoleCredentials(role: StorageRole, env: Record<string, string | undefined>, isDevTarget: boolean) {
  const rolePairs: Record<StorageRole, [string, string]> = {
    'upload-signer': ['R2_UPLOAD_SIGNER_ACCESS_KEY_ID', 'R2_UPLOAD_SIGNER_SECRET_ACCESS_KEY'],
    processor: ['R2_PROCESSOR_ACCESS_KEY_ID', 'R2_PROCESSOR_SECRET_ACCESS_KEY'],
    reader: ['R2_READER_ACCESS_KEY_ID', 'R2_READER_SECRET_ACCESS_KEY'],
    'admin-lifecycle': ['R2_ADMIN_ACCESS_KEY_ID', 'R2_ADMIN_SECRET_ACCESS_KEY'],
  };
  const [akKey, skKey] = rolePairs[role];
  const ak = (env[akKey] || '').trim();
  const sk = (env[skKey] || '').trim();
  if (ak && sk) return { accessKeyId: ak, secretAccessKey: sk };

  if (isDevTarget) {
    const devAk = (env.R2_DEV_ACCESS_KEY_ID || '').trim();
    const devSk = (env.R2_DEV_SECRET_ACCESS_KEY || '').trim();
    if (devAk && devSk) return { accessKeyId: devAk, secretAccessKey: devSk };
  }
  return null;
}

export function resolveStorageRuntime(
  env: Record<string, string | undefined> = process.env
): StorageRuntimeResolution {
  if (!(env.MONGODB_URI || '').trim()) {
    return { configured: false, reason: 'Storage metadata database not configured' };
  }

  const useDev = Boolean((env.R2_DEV_ENDPOINT || '').trim() && (env.R2_DEV_ACCESS_KEY_ID || '').trim());
  if (useDev) {
    const buckets: ResolvedBuckets = {
      public: (env.R2_DEV_PUBLIC_BUCKET_NAME || 'adzunova-dev-public').trim(),
      private: (env.R2_DEV_PRIVATE_BUCKET_NAME || 'adzunova-dev-private').trim(),
      quarantine: (env.R2_DEV_QUARANTINE_BUCKET_NAME || 'adzunova-dev-quarantine').trim(),
      exports: (env.R2_DEV_EXPORTS_BUCKET_NAME || 'adzunova-dev-exports').trim(),
    };
    assertDevBucketPrefix(buckets.public);
    assertDevBucketPrefix(buckets.private);
    assertDevBucketPrefix(buckets.quarantine);
    assertDevBucketPrefix(buckets.exports);
    return {
      configured: true,
      endpoint: (env.R2_DEV_ENDPOINT || '').trim(),
      cdnBase: (env.NEXT_PUBLIC_CDN_BASE || '').trim(),
      buckets,
      isDevTarget: true,
    };
  }

  const endpoint = (env.R2_ENDPOINT || '').trim();
  if (!endpoint) {
    return { configured: false, reason: 'Storage not configured (R2_ENDPOINT / R2_DEV_ENDPOINT missing)' };
  }

  return {
    configured: true,
    endpoint,
    cdnBase: (env.NEXT_PUBLIC_CDN_BASE || '').trim(),
    buckets: {
      public: (env.R2_PUBLIC_BUCKET_NAME || '').trim(),
      private: (env.R2_PRIVATE_BUCKET_NAME || '').trim(),
      quarantine: (env.R2_QUARANTINE_BUCKET_NAME || '').trim(),
      exports: (env.R2_EXPORTS_BUCKET_NAME || '').trim(),
    },
    isDevTarget: false,
  };
}

const adapterCache = new Map<string, ObjectStoragePort>();

export function getStorageAdapterForRole(
  role: StorageRole,
  env: Record<string, string | undefined> = process.env
): { ok: true; port: ObjectStoragePort; runtime: Required<Pick<StorageRuntimeResolution, 'endpoint' | 'buckets' | 'cdnBase' | 'isDevTarget'>> } | { ok: false; reason: string } {
  const runtime = resolveStorageRuntime(env);
  if (!runtime.configured || !runtime.endpoint || !runtime.buckets) {
    return { ok: false, reason: runtime.reason || 'Storage not configured' };
  }

  const creds = getRoleCredentials(role, env, Boolean(runtime.isDevTarget));
  if (!creds) {
    return { ok: false, reason: `Storage role "${role}" is not configured` };
  }

  const cacheKey = `${role}::${runtime.endpoint}::${creds.accessKeyId}`;
  let port = adapterCache.get(cacheKey);
  if (!port) {
    port = enforceRolePermission(new R2S3Adapter(role, runtime.endpoint, creds));
    adapterCache.set(cacheKey, port);
  }

  return {
    ok: true,
    port,
    runtime: {
      endpoint: runtime.endpoint,
      buckets: runtime.buckets,
      cdnBase: runtime.cdnBase || '',
      isDevTarget: Boolean(runtime.isDevTarget),
    },
  };
}
