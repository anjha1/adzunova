import crypto from 'node:crypto';
import type { ClientSession } from 'mongodb';
import { getPaymentsMongoDb } from './client';
import { scrubSecrets } from '@adzunova/problem-details';

export interface AuditEventInput {
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  reason?: string;
  payload: Record<string, unknown>;
}

export interface StoredAuditEvent {
  seq: number;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  reason: string | null;
  payloadJson: string;
  prevHash: string;
  hash: string;
  createdAt: Date;
}

const GENESIS_HASH = '0'.repeat(64);

function computeAuditHash(fields: {
  seq: number;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  reason: string | null;
  payloadJson: string;
  prevHash: string;
  createdAtIso: string;
}): string {
  const canonical = JSON.stringify(fields);
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

export async function appendPaymentAuditEvent(
  input: AuditEventInput,
  session?: ClientSession
): Promise<StoredAuditEvent> {
  const db = await getPaymentsMongoDb();
  const counters = db.collection<{ _id: string; seq: number }>('pay_counters');
  const events = db.collection<StoredAuditEvent>('pay_audit_events');

  const counterRes = await counters.findOneAndUpdate(
    { _id: 'pay_audit_seq' },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after', session }
  );
  const seq = counterRes?.seq ?? 1;

  let prevHash = GENESIS_HASH;
  if (seq > 1) {
    const prev = await events.findOne({ seq: seq - 1 }, { session });
    if (prev) prevHash = prev.hash;
  }

  const createdAt = new Date();
  const payloadJson = scrubSecrets(JSON.stringify(input.payload));
  const reason = input.reason ? scrubSecrets(input.reason) : null;
  const hash = computeAuditHash({
    seq,
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    reason,
    payloadJson,
    prevHash,
    createdAtIso: createdAt.toISOString(),
  });

  const doc: StoredAuditEvent = {
    seq,
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    reason,
    payloadJson,
    prevHash,
    hash,
    createdAt,
  };

  await events.insertOne(doc, { session });
  return doc;
}

export async function verifyAuditHashChain(limit = 500): Promise<{
  ok: boolean;
  checked: number;
  brokenAtSeq?: number;
}> {
  const db = await getPaymentsMongoDb();
  const events = await db
    .collection<StoredAuditEvent>('pay_audit_events')
    .find({})
    .sort({ seq: 1 })
    .limit(limit)
    .toArray();

  let expectedPrev = GENESIS_HASH;
  for (const ev of events) {
    if (ev.prevHash !== expectedPrev) {
      return { ok: false, checked: events.length, brokenAtSeq: ev.seq };
    }
    const recomputed = computeAuditHash({
      seq: ev.seq,
      actorId: ev.actorId,
      actorRole: ev.actorRole,
      action: ev.action,
      resourceType: ev.resourceType,
      resourceId: ev.resourceId,
      reason: ev.reason,
      payloadJson: ev.payloadJson,
      prevHash: ev.prevHash,
      createdAtIso: ev.createdAt.toISOString(),
    });
    if (recomputed !== ev.hash) {
      return { ok: false, checked: events.length, brokenAtSeq: ev.seq };
    }
    expectedPrev = ev.hash;
  }
  return { ok: true, checked: events.length };
}
