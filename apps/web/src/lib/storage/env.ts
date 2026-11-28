import { z } from 'zod';
import type { StorageRole } from './resilience';

const positiveIntFromEnv = (fallback: number) =>
  z.preprocess(
    (v) => (v === undefined || v === '' ? String(fallback) : v),
    z
      .string()
      .trim()
      .regex(/^\d+$/, 'Must be a positive integer string')
      .transform((v) => Number.parseInt(v, 10))
      .refine((n) => Number.isSafeInteger(n) && n > 0, 'Must be > 0')
  );

export const StorageEnvSchema = z.object({
  R2_ACCOUNT_ID: z.string().trim().min(1),
  R2_ENDPOINT: z.string().trim().url().startsWith('https://'),
  R2_PUBLIC_BUCKET_NAME: z.string().trim().min(1),
  R2_PRIVATE_BUCKET_NAME: z.string().trim().min(1),
  R2_QUARANTINE_BUCKET_NAME: z.string().trim().min(1),
  R2_EXPORTS_BUCKET_NAME: z.string().trim().min(1),
  NEXT_PUBLIC_CDN_BASE: z.string().trim().url().startsWith('https://'),
  R2_UPLOAD_URL_EXPIRY: positiveIntFromEnv(900),
  R2_DOWNLOAD_URL_EXPIRY: positiveIntFromEnv(300),
  R2_MULTIPART_PART_SIZE_BYTES: positiveIntFromEnv(5 * 1024 * 1024),
  R2_MULTIPART_THRESHOLD_BYTES: positiveIntFromEnv(10 * 1024 * 1024),
  MAX_IMAGE_SIZE_BYTES: positiveIntFromEnv(10 * 1024 * 1024),
  MAX_PDF_SIZE_BYTES: positiveIntFromEnv(25 * 1024 * 1024),
  MAX_VIDEO_SIZE_BYTES: positiveIntFromEnv(500 * 1024 * 1024),
  MONGODB_URI: z.string().trim().min(1),
});

export interface StorageFeatureFlags {
  storageUploads: boolean;
  s1Presign: boolean;
  s2Multipart: boolean;
  s3Processing: boolean;
  s4Scanner: boolean;
  s5CdnMirror: boolean;
  s6Exports: boolean;
}

export function getStorageFeatureFlags(
  env: Record<string, string | undefined> = process.env
): StorageFeatureFlags {
  return {
    storageUploads: env.FEATURE_STORAGE_UPLOADS === 'true',
    s1Presign: env.FEATURE_STORAGE_S1_PRESIGN === 'true',
    s2Multipart: env.FEATURE_STORAGE_S2_MULTIPART === 'true',
    s3Processing: env.FEATURE_STORAGE_S3_PROCESSING === 'true',
    s4Scanner: env.FEATURE_STORAGE_S4_SCANNER === 'true',
    s5CdnMirror: env.FEATURE_STORAGE_S5_CDN_MIRROR === 'true',
    s6Exports: env.FEATURE_STORAGE_S6_EXPORTS === 'true',
  };
}

export interface RoleConfigStatus {
  role: StorageRole;
  configured: boolean;
  status: 'ACTIVE' | 'NOT_CONFIGURED';
  reason?: string;
}

export interface StorageConfigStatus {
  configured: boolean;
  status: 'ACTIVE' | 'NOT_CONFIGURED';
  message: string;
  missingVars: string[];
  invalidVars: string[];
  metadataDbConfigured: boolean;
  roles: Record<StorageRole, RoleConfigStatus>;
  flags: StorageFeatureFlags;
}

const ROLE_ENV_KEYS: Record<StorageRole, { keyId: string; secretKey: string }> = {
  'upload-signer': {
    keyId: 'R2_UPLOAD_SIGNER_ACCESS_KEY_ID',
    secretKey: 'R2_UPLOAD_SIGNER_SECRET_ACCESS_KEY',
  },
  processor: {
    keyId: 'R2_PROCESSOR_ACCESS_KEY_ID',
    secretKey: 'R2_PROCESSOR_SECRET_ACCESS_KEY',
  },
  reader: {
    keyId: 'R2_READER_ACCESS_KEY_ID',
    secretKey: 'R2_READER_SECRET_ACCESS_KEY',
  },
  'admin-lifecycle': {
    keyId: 'R2_ADMIN_ACCESS_KEY_ID',
    secretKey: 'R2_ADMIN_SECRET_ACCESS_KEY',
  },
};

export function getRoleConfigStatus(
  role: StorageRole,
  env: Record<string, string | undefined> = process.env
): RoleConfigStatus {
  const keys = ROLE_ENV_KEYS[role];
  const hasRolePair = Boolean((env[keys.keyId] || '').trim() && (env[keys.secretKey] || '').trim());
  if (!hasRolePair) {
    return {
      role,
      configured: false,
      status: 'NOT_CONFIGURED',
      reason: `Not configured (${keys.keyId} / ${keys.secretKey} missing)`,
    };
  }
  return { role, configured: true, status: 'ACTIVE' };
}

const REQUIRED_STORAGE_KEYS = [
  'R2_ACCOUNT_ID',
  'R2_ENDPOINT',
  'R2_PUBLIC_BUCKET_NAME',
  'R2_PRIVATE_BUCKET_NAME',
  'R2_QUARANTINE_BUCKET_NAME',
  'R2_EXPORTS_BUCKET_NAME',
  'NEXT_PUBLIC_CDN_BASE',
  'MONGODB_URI',
] as const;

export function assertDevBucketPrefix(bucketName: string): void {
  if (!bucketName || !bucketName.startsWith('adzunova-dev-')) {
    throw new Error(
      `SAFETY REFUSAL: Test/probe bucket "${bucketName}" must start with "adzunova-dev-". Production buckets are strictly forbidden.`
    );
  }
}

export function getStorageConfigStatus(
  env: Record<string, string | undefined> = process.env
): StorageConfigStatus {
  const flags = getStorageFeatureFlags(env);
  const metadataDbConfigured = Boolean((env.MONGODB_URI || '').trim());
  const missingVars = REQUIRED_STORAGE_KEYS.filter((k) => !(env[k] || '').trim());

  const roles: Record<StorageRole, RoleConfigStatus> = {
    'upload-signer': getRoleConfigStatus('upload-signer', env),
    processor: getRoleConfigStatus('processor', env),
    reader: getRoleConfigStatus('reader', env),
    'admin-lifecycle': getRoleConfigStatus('admin-lifecycle', env),
  };

  if (!metadataDbConfigured) {
    return {
      configured: false,
      status: 'NOT_CONFIGURED',
      message: 'Storage metadata database not configured',
      missingVars: [...missingVars],
      invalidVars: [],
      metadataDbConfigured: false,
      roles,
      flags,
    };
  }

  if (missingVars.length > 0) {
    return {
      configured: false,
      status: 'NOT_CONFIGURED',
      message: 'Storage not configured',
      missingVars: [...missingVars],
      invalidVars: [],
      metadataDbConfigured,
      roles,
      flags,
    };
  }

  const parsed = StorageEnvSchema.safeParse(env);
  if (!parsed.success) {
    const invalidVars = Array.from(
      new Set(parsed.error.issues.map((issue) => String(issue.path[0] || 'unknown')))
    );
    return {
      configured: false,
      status: 'NOT_CONFIGURED',
      message: 'Storage not configured',
      missingVars: [],
      invalidVars,
      metadataDbConfigured,
      roles,
      flags,
    };
  }

  const anyRoleConfigured = Object.values(roles).some((r) => r.configured);
  if (!anyRoleConfigured) {
    return {
      configured: false,
      status: 'NOT_CONFIGURED',
      message: 'Storage not configured (no per-role R2 credentials set)',
      missingVars: [],
      invalidVars: [],
      metadataDbConfigured,
      roles,
      flags,
    };
  }

  return {
    configured: true,
    status: 'ACTIVE',
    message: 'Storage configured',
    missingVars: [],
    invalidVars: [],
    metadataDbConfigured,
    roles,
    flags,
  };
}
