import { getPaymentsMongoDb } from './client';
import { scrubSecrets } from '@adzunova/problem-details';

export interface EnqueueJobInput {
  queueName: string;
  jobType: string;
  dedupKey: string;
  payload: Record<string, unknown>;
  runAt?: Date;
  maxAttempts?: number;
}

export interface QueueJobRecord {
  queueName: string;
  jobType: string;
  dedupKey: string;
  payloadJson: string;
  status: 'PENDING' | 'LEASED' | 'COMPLETED' | 'DLQ';
  attempts: number;
  maxAttempts: number;
  runAt: Date;
  lockedBy: string | null;
  lockedUntil: Date | null;
  lastError: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueuePort {
  enqueue(input: EnqueueJobInput): Promise<{ enqueued: boolean; dedupKey: string }>;
  leaseNext(queueName: string, workerId: string, leaseMs?: number): Promise<QueueJobRecord | null>;
  ack(dedupKey: string, workerId: string): Promise<boolean>;
  fail(job: QueueJobRecord, errorMessage: string): Promise<'RETRY' | 'DLQ'>;
}

export class MongoQueueAdapter implements QueuePort {
  async enqueue(input: EnqueueJobInput): Promise<{ enqueued: boolean; dedupKey: string }> {
    const db = await getPaymentsMongoDb();
    const now = new Date();
    try {
      await db.collection<QueueJobRecord>('pay_queue_jobs').insertOne({
        queueName: input.queueName,
        jobType: input.jobType,
        dedupKey: input.dedupKey,
        payloadJson: scrubSecrets(JSON.stringify(input.payload)),
        status: 'PENDING',
        attempts: 0,
        maxAttempts: input.maxAttempts ?? 5,
        runAt: input.runAt ?? now,
        lockedBy: null,
        lockedUntil: null,
        lastError: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      });
      return { enqueued: true, dedupKey: input.dedupKey };
    } catch (err: unknown) {
      const mongoErr = err as { code?: number };
      if (mongoErr?.code === 11000) {
        return { enqueued: false, dedupKey: input.dedupKey };
      }
      throw err;
    }
  }

  async leaseNext(
    queueName: string,
    workerId: string,
    leaseMs = 30_000
  ): Promise<QueueJobRecord | null> {
    const db = await getPaymentsMongoDb();
    const now = new Date();
    const lockedUntil = new Date(now.getTime() + leaseMs);
    const res = await db.collection<QueueJobRecord>('pay_queue_jobs').findOneAndUpdate(
      {
        queueName,
        $or: [
          { status: 'PENDING', runAt: { $lte: now } },
          { status: 'LEASED', lockedUntil: { $lte: now } },
        ],
      },
      {
        $set: {
          status: 'LEASED',
          lockedBy: workerId,
          lockedUntil,
          updatedAt: now,
        },
        $inc: { attempts: 1 },
      },
      { sort: { runAt: 1, createdAt: 1 }, returnDocument: 'after' }
    );
    return res ?? null;
  }

  async ack(dedupKey: string, workerId: string): Promise<boolean> {
    const db = await getPaymentsMongoDb();
    const now = new Date();
    const res = await db.collection<QueueJobRecord>('pay_queue_jobs').updateOne(
      { dedupKey, lockedBy: workerId, status: 'LEASED' },
      {
        $set: {
          status: 'COMPLETED',
          completedAt: now,
          lockedBy: null,
          lockedUntil: null,
          updatedAt: now,
        },
      }
    );
    return res.modifiedCount === 1;
  }

  async fail(job: QueueJobRecord, errorMessage: string): Promise<'RETRY' | 'DLQ'> {
    const db = await getPaymentsMongoDb();
    const now = new Date();
    const cleanErr = scrubSecrets(errorMessage);
    if (job.attempts >= job.maxAttempts) {
      await db.collection<QueueJobRecord>('pay_queue_jobs').updateOne(
        { dedupKey: job.dedupKey },
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
        sourceType: 'QUEUE',
        sourceId: job.dedupKey,
        eventType: job.jobType,
        payloadJson: job.payloadJson,
        errorMessage: cleanErr,
        attempts: job.attempts,
        replayedAt: null,
        replayedBy: null,
        createdAt: now,
      });
      return 'DLQ';
    }

    const backoffMs = Math.min(60_000, 1000 * Math.pow(2, job.attempts));
    await db.collection<QueueJobRecord>('pay_queue_jobs').updateOne(
      { dedupKey: job.dedupKey },
      {
        $set: {
          status: 'PENDING',
          runAt: new Date(now.getTime() + backoffMs),
          lastError: cleanErr,
          lockedBy: null,
          lockedUntil: null,
          updatedAt: now,
        },
      }
    );
    return 'RETRY';
  }
}
