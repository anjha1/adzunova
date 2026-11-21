import crypto from 'crypto';
import { AuditLogEntity } from '../entities/models';

/**
 * Immutable, Append-Only, Tamper-Evident Hash Chain Audit Engine
 * Guarantees cryptographic integrity of all administrative and financial actions.
 */

export const GENESIS_HASH = '0'.repeat(64);

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Deterministically sorts keys for stable cryptographic hashing
 */
function canonicalizePayload(payload: any): string {
  if (payload === null || payload === undefined) {
    return '';
  }
  if (typeof payload !== 'object') {
    return String(payload);
  }
  if (Array.isArray(payload)) {
    return JSON.stringify(payload.map((item) => (typeof item === 'object' ? JSON.parse(canonicalizePayload(item)) : item)));
  }
  const sortedKeys = Object.keys(payload).sort();
  const sortedObj: Record<string, any> = {};
  for (const k of sortedKeys) {
    sortedObj[k] = payload[k];
  }
  return JSON.stringify(sortedObj);
}

export interface AuditEntryInput {
  workspaceId: string;
  actorId: string;
  actorEmail?: string;
  actorIp?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  payload?: any;
  createdAt?: Date;
}

/**
 * Computes the SHA-256 hash for an audit log entry chained to its predecessor.
 */
export function computeAuditEntryHash(
  previousHash: string,
  timestampIso: string,
  actorId: string,
  workspaceId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  payload: any
): string {
  const canonPayload = canonicalizePayload(payload);
  const rawMessage = `${previousHash}|${timestampIso}|${actorId}|${workspaceId}|${action}|${resourceType}|${resourceId}|${canonPayload}`;
  return sha256(rawMessage);
}

/**
 * Constructs a new chained audit entry.
 */
export function buildChainedAuditEntry(
  input: AuditEntryInput,
  latestPreviousHash?: string
): AuditLogEntity {
  const previousHash = latestPreviousHash || GENESIS_HASH;
  const createdAt = input.createdAt || new Date();
  const timestampIso = createdAt.toISOString();

  const hash = computeAuditEntryHash(
    previousHash,
    timestampIso,
    input.actorId,
    input.workspaceId,
    input.action,
    input.resourceType,
    input.resourceId,
    input.payload
  );

  return {
    _id: crypto.randomBytes(12).toString('hex'),
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    actorEmail: input.actorEmail,
    actorIp: input.actorIp,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    previousHash,
    hash,
    payload: input.payload,
    createdAt,
  };
}

export interface ChainVerificationResult {
  valid: boolean;
  totalEntries: number;
  brokenAtIndex?: number;
  error?: string;
}

/**
 * Cryptographically verifies that the audit log chain is continuous, unbroken, and untampered.
 */
export function verifyAuditChain(entries: AuditLogEntity[]): ChainVerificationResult {
  if (!entries || entries.length === 0) {
    return { valid: true, totalEntries: 0 };
  }

  // Sort chronological ascending
  const sorted = [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const timestampIso = new Date(current.createdAt).toISOString();

    // Verify linkage to previous entry
    if (i === 0) {
      if (current.previousHash !== GENESIS_HASH) {
        return {
          valid: false,
          totalEntries: sorted.length,
          brokenAtIndex: 0,
          error: `Genesis entry does not link to genesis hash. Found: ${current.previousHash}`,
        };
      }
    } else {
      const predecessor = sorted[i - 1];
      if (current.previousHash !== predecessor.hash) {
        return {
          valid: false,
          totalEntries: sorted.length,
          brokenAtIndex: i,
          error: `Chain broken at entry index ${i}. Expected previousHash '${predecessor.hash}', but found '${current.previousHash}'.`,
        };
      }
    }

    // Recompute current entry hash
    const expectedHash = computeAuditEntryHash(
      current.previousHash,
      timestampIso,
      current.actorId,
      current.workspaceId,
      current.action,
      current.resourceType,
      current.resourceId,
      current.payload
    );

    if (current.hash !== expectedHash) {
      return {
        valid: false,
        totalEntries: sorted.length,
        brokenAtIndex: i,
        error: `Tamper detected at entry index ${i}. Recorded hash '${current.hash}' does not match recomputed payload hash '${expectedHash}'.`,
      };
    }
  }

  return { valid: true, totalEntries: sorted.length };
}

/**
 * Formats audit logs as RFC 4180 compliant CSV.
 */
export function exportAuditLogsToCsv(entries: AuditLogEntity[]): string {
  const headers = [
    'Timestamp',
    'Action',
    'Actor ID',
    'Actor Email',
    'Actor IP',
    'Resource Type',
    'Resource ID',
    'Previous Hash',
    'Current Hash',
    'Payload',
  ];

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = entries.map((e) => [
    escapeCsv(new Date(e.createdAt).toISOString()),
    escapeCsv(e.action),
    escapeCsv(e.actorId),
    escapeCsv(e.actorEmail || ''),
    escapeCsv(e.actorIp || ''),
    escapeCsv(e.resourceType),
    escapeCsv(e.resourceId),
    escapeCsv(e.previousHash),
    escapeCsv(e.hash),
    escapeCsv(e.payload || {}),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Formats audit logs as formatted JSON with integrity manifest.
 */
export function exportAuditLogsToJson(entries: AuditLogEntity[]): string {
  const verification = verifyAuditChain(entries);
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      integrity: {
        isChainIntact: verification.valid,
        totalEntries: verification.totalEntries,
        error: verification.error || null,
      },
      entries,
    },
    null,
    2
  );
}
