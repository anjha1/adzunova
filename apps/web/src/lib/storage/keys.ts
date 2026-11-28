import crypto from 'node:crypto';

export const MAX_R2_KEY_BYTES = 1024;
const SHA256_HEX_REGEX = /^[0-9a-f]{64}$/;
const SAFE_SEGMENT_REGEX = /^[a-z0-9_-]{1,64}$/;
const SAFE_EXT_REGEX = /^[a-z0-9]{1,10}$/;
const PII_EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PII_PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;

export type ParsedStorageKey =
  | { kind: 'public'; assetKind: string; prefix: string; sha256: string; ext: string }
  | { kind: 'private'; domain: string; tenantShard: string; entityId: string; assetId: string; version: number; ext: string }
  | { kind: 'ingest'; sessionId: string; objectOrPart: string }
  | { kind: 'exports'; jobId: string; file: string };

function assertSafeKeyString(key: string): void {
  if (!key || key.includes('..') || key.includes('\\') || /[\x00-\x1f\x7f]/.test(key)) {
    throw new Error(`Invalid storage key: forbidden characters or traversal`);
  }
  if (Buffer.byteLength(key, 'utf8') > MAX_R2_KEY_BYTES) {
    throw new Error(`Storage key exceeds R2 maximum length (${MAX_R2_KEY_BYTES} bytes)`);
  }
  if (PII_EMAIL_REGEX.test(key) || PII_PAN_REGEX.test(key)) {
    throw new Error(`Storage key must never contain PII`);
  }
}

export function computeTenantShard(tenantId: string): string {
  return crypto.createHash('sha256').update(tenantId).digest('hex').slice(0, 4);
}

/**
 * Immutable content-addressed public key:
 * public/{kind}/{sha256[0..2]}/{sha256}.{ext}
 * Why immutable: safe long-lived CDN caching and avoids R2's 1 write/sec per-key limit (ADR 0001).
 */
export function buildPublicKey(params: { kind: string; sha256: string; ext: string }): string {
  const kind = params.kind.toLowerCase();
  const sha256 = params.sha256.toLowerCase();
  const ext = params.ext.toLowerCase().replace(/^\./, '');

  if (!SAFE_SEGMENT_REGEX.test(kind)) throw new Error(`Invalid public kind: ${kind}`);
  if (!SHA256_HEX_REGEX.test(sha256)) throw new Error(`Invalid sha256 hex`);
  if (!SAFE_EXT_REGEX.test(ext)) throw new Error(`Invalid extension: ${ext}`);

  const key = `public/${kind}/${sha256.slice(0, 2)}/${sha256}.${ext}`;
  assertSafeKeyString(key);
  return key;
}

/**
 * Versioned private key:
 * private/{domain}/{tenantShard}/{entityId}/{assetId}/v{n}/original.{ext}
 */
export function buildPrivateKey(params: {
  domain: string;
  tenantShard: string;
  entityId: string;
  assetId: string;
  version: number;
  ext: string;
}): string {
  const domain = params.domain.toLowerCase();
  const tenantShard = params.tenantShard.toLowerCase();
  const entityId = params.entityId.toLowerCase();
  const assetId = params.assetId.toLowerCase();
  const ext = params.ext.toLowerCase().replace(/^\./, '');

  if (!SAFE_SEGMENT_REGEX.test(domain)) throw new Error(`Invalid domain`);
  if (!/^[0-9a-f]{4}$/.test(tenantShard)) throw new Error(`Invalid tenantShard`);
  if (!SAFE_SEGMENT_REGEX.test(entityId)) throw new Error(`Invalid entityId`);
  if (!SAFE_SEGMENT_REGEX.test(assetId)) throw new Error(`Invalid assetId`);
  if (!Number.isInteger(params.version) || params.version < 1) throw new Error(`Invalid version`);
  if (!SAFE_EXT_REGEX.test(ext)) throw new Error(`Invalid ext`);

  const key = `private/${domain}/${tenantShard}/${entityId}/${assetId}/v${params.version}/original.${ext}`;
  assertSafeKeyString(key);
  return key;
}

export function buildIngestKey(params: { sessionId: string; objectOrPart: string }): string {
  const sessionId = params.sessionId.toLowerCase();
  const objectOrPart = params.objectOrPart.toLowerCase();
  if (!SAFE_SEGMENT_REGEX.test(sessionId)) throw new Error(`Invalid sessionId`);
  if (!/^[a-z0-9._-]{1,64}$/.test(objectOrPart) || objectOrPart.includes('..')) {
    throw new Error(`Invalid objectOrPart`);
  }
  const key = `ingest/${sessionId}/${objectOrPart}`;
  assertSafeKeyString(key);
  return key;
}

export function buildExportKey(params: { jobId: string; file: string }): string {
  const jobId = params.jobId.toLowerCase();
  const file = params.file.toLowerCase();
  if (!SAFE_SEGMENT_REGEX.test(jobId)) throw new Error(`Invalid jobId`);
  if (!/^[a-z0-9._-]{1,64}$/.test(file) || file.includes('..')) {
    throw new Error(`Invalid export file name`);
  }
  const key = `exports/${jobId}/${file}`;
  assertSafeKeyString(key);
  return key;
}

export function parseStorageKey(key: string): ParsedStorageKey {
  assertSafeKeyString(key);
  const parts = key.split('/');

  if (parts[0] === 'public' && parts.length === 4) {
    const [, assetKind, prefix, file] = parts;
    const dotIdx = file.lastIndexOf('.');
    if (dotIdx <= 0) throw new Error('Invalid public key filename');
    const sha256 = file.slice(0, dotIdx);
    const ext = file.slice(dotIdx + 1);
    if (prefix !== sha256.slice(0, 2) || !SHA256_HEX_REGEX.test(sha256)) {
      throw new Error('Public key hash prefix mismatch');
    }
    return { kind: 'public', assetKind, prefix, sha256, ext };
  }

  if (parts[0] === 'private' && parts.length === 7) {
    const [, domain, tenantShard, entityId, assetId, vSeg, file] = parts;
    const vMatch = /^v(\d+)$/.exec(vSeg);
    const fMatch = /^original\.([a-z0-9]{1,10})$/.exec(file);
    if (!vMatch || !fMatch) throw new Error('Invalid private key version or filename');
    return {
      kind: 'private',
      domain,
      tenantShard,
      entityId,
      assetId,
      version: Number(vMatch[1]),
      ext: fMatch[1],
    };
  }

  if (parts[0] === 'ingest' && parts.length === 3) {
    return { kind: 'ingest', sessionId: parts[1], objectOrPart: parts[2] };
  }

  if (parts[0] === 'exports' && parts.length === 3) {
    return { kind: 'exports', jobId: parts[1], file: parts[2] };
  }

  throw new Error(`Unrecognized storage key format: ${key}`);
}
