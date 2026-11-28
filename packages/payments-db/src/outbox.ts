import crypto from 'node:crypto';
import type { ClientSession } from 'mongodb';
import { getPaymentsMongoDb } from './client';
import { scrubSecrets } from '@adzunova/problem-details';

export interface OutboxEnqueueInput {
  eventId?: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  maxAttempts?: number;
}

export interface OutboxEventRecord {
  eventId: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payloadJson: string;
  status: 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'DLQ';
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: Date;
  lockedBy: string | null;
  lockedUntil: Date | null;
  lastError: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function enqueueOutboxEvent(
  input: OutboxEnqueueInput,
  session?: ClientSession
): Promise<string> {
  const db = await getPaymentsMongoDb();
  const eventId = input.eventId ?? `evt_${crypto.randomUUID()}`;
  const now = new Date();
  await db.collection<OutboxEventRecord>('pay_outbox_events').insertOne(
    {
      eventId,
      eventType: input.eventType,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      payloadJson: scrubSecrets(JSON.stringify(input.payload)),
      status: 'PENDING',
      attempts: 0,
      maxAttempts: input.maxAttempts ?? 5,
      nextAttemptAt: now,
      lockedBy: null,
      lockedUntil: null,
      lastError: null,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    },
    { session }
  );
  return eventId;
}

export async function claimNextOutboxEvent(
  workerId: string,
  leaseMs = 30_000
): Promise<OutboxEventRecord | null> {
  const db = await getPaymentsMongoDb();
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + leaseMs);
  const res = await db.collection<OutboxEventRecord>('pay_outbox_events').findOneAndUpdate(
    {
      $or: [
        { status: 'PENDING', nextAttemptAt: { $lte: now } },
        { status: 'PROCESSING', lockedUntil: { $lte: now } },
      ],
    },
    {
      $set: {
        status: 'PROCESSING',
        lockedBy: workerId,
        lockedUntil,
        updatedAt: now,
      },
      $inc: { attempts: 1 },
    },
    { sort: { nextAttemptAt: 1, createdAt: 1 }, returnDocument: 'after' }
  );
  return res ?? null;
}

export async function markOutboxPublished(eventId: string, workerId: string): Promise<boolean> {
  const db = await getPaymentsMongoDb();
  const now = new Date();
  const res = await db.collection<OutboxEventRecord>('pay_outbox_events').updateOne(
    { eventId, lockedBy: workerId, status: 'PROCESSING' },
    {
      $set: {
        status: 'PUBLISHED',
        publishedAt: now,
        lockedBy: null,
        lockedUntil: null,
        updatedAt: now,
      },
    }
  );
  return res.modifiedCount === 1;
}

export async function markOutboxFailed(
  event: OutboxEventRecord,
  errorMessage: string
): Promise<'RETRY' | 'DLQ'> {
  const db = await getPaymentsMongoDb();
  const now = new Date();
  const cleanErr = scrubSecrets(errorMessage);
  if (event.attempts >= event.maxAttempts) {
    await db.collection<OutboxEventRecord>('pay_outbox_events').updateOne(
      { eventId: event.eventId },
      {
        $set: {
          status: 'DLQ',
          lastError: cleanErr,
          lockedBy: null,
          lockedUntil: null,
          updatedAt: now,
        },
      }
    );
    await db.collection('pay_dlq_events').insertOne({
      sourceType: 'OUTBOX',
      sourceId: event.eventId,
      eventType: event.eventType,
      payloadJson: event.payloadJson,
      errorMessage: cleanErr,
      attempts: event.attempts,
      replayedAt: null,
      replayedBy: null,
      createdAt: now,
    });
    return 'DLQ';
  }

  const backoffMs = Math.min(60_000, 1000 * Math.pow(2, event.attempts));
  await db.collection<OutboxEventRecord>('pay_outbox_events').updateOne(
    { eventId: event.eventId },
    {
      $set: {
        status: 'PENDING',
        nextAttemptAt: new Date(now.getTime() + backoffMs),
        lastError: cleanErr,
        lockedBy: null,
        lockedUntil: null,
        updatedAt: now,
      },
    }
  );
  return 'RETRY';
}

export async function consumeEventOnce(params: {
  consumerName: string;
  eventId: string;
  handler: () => Promise<void>;
}): Promise<{ processed: boolean; duplicate: boolean }> {
  const db = await getPaymentsMongoDb();
  try {
    await db.collection('pay_consumed_events').insertOne({
      consumerName: params.consumerName,
      eventId: params.eventId,
      processedAt: new Date(),
    });
  } catch (err: unknown) {
    const mongoErr = err as { code?: number };
    if (mongoErr?.code === 11000) {
      return { processed: false, duplicate: true };
    }
    throw err;
  }
  await params.handler();
  return { processed: true, duplicate: false };
}

export async function replayDlqOutboxEvent(
  sourceId: string,
  replayedBy: string
): Promise<boolean> {
  const db = await getPaymentsMongoDb();
  const now = new Date();
  const res = await db.collection('pay_outbox_events').updateOne(
    { eventId: sourceId, status: 'DLQ' },
    {
      $set: {
        status: 'PENDING',
        attempts: 0,
        nextAttemptAt: now,
        lockedBy: null,
        lockedUntil: null,
        updatedAt: now,
      },
    }
  );
  if (res.modifiedCount === 0) return false;
  await db.collection('pay_dlq_events').updateMany(
    { sourceType: 'OUTBOX', sourceId, replayedAt: null },
    { $set: { replayedAt: now, replayedBy } }
  );
  return true;
}
