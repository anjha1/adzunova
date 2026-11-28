import crypto from 'node:crypto';
import { getPaymentsMongoDb } from './client';
import { AppProblemError } from '@adzunova/problem-details';

export interface IdempotencyBeginResult<T = unknown> {
  state: 'ACQUIRED' | 'REPLAY' | 'IN_PROGRESS';
  response?: { statusCode: number; body: T };
}

export function hashIdempotencyPayload(payload: unknown): string {
  const canonical = JSON.stringify(payload ?? null);
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

export async function beginIdempotentOperation<T = unknown>(params: {
  scope: string;
  key: string;
  requestPayload: unknown;
  ttlSeconds?: number;
}): Promise<IdempotencyBeginResult<T>> {
  const { scope, key, requestPayload, ttlSeconds = 86400 } = params;
  if (!key || key.trim().length < 8) {
    throw new AppProblemError({
      status: 400,
      code: 'INVALID_IDEMPOTENCY_KEY',
      title: 'Invalid Idempotency Key',
      detail: 'Idempotency-Key header must be at least 8 characters',
    });
  }

  const db = await getPaymentsMongoDb();
  const col = db.collection('pay_idempotency');
  const requestHash = hashIdempotencyPayload(requestPayload);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

  try {
    await col.insertOne({
      scope,
      key,
      requestHash,
      status: 'IN_PROGRESS',
      statusCode: null,
      responseJson: null,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });
    return { state: 'ACQUIRED' };
  } catch (err: unknown) {
    const mongoErr = err as { code?: number };
    if (mongoErr?.code !== 11000) {
      throw err;
    }
  }

  const existing = await col.findOne({ scope, key });
  if (!existing) {
    throw new AppProblemError({
      status: 409,
      code: 'IDEMPOTENCY_CONFLICT',
      title: 'Idempotency Conflict',
      detail: 'Concurrent idempotency state collision; retry request',
    });
  }

  if (existing.requestHash !== requestHash) {
    throw new AppProblemError({
      status: 409,
      code: 'IDEMPOTENCY_KEY_PAYLOAD_MISMATCH',
      title: 'Idempotency Key Reused With Different Payload',
      detail: 'The same Idempotency-Key cannot be reused with a different request payload',
    });
  }

  if (existing.status === 'COMPLETED' && existing.responseJson) {
    return {
      state: 'REPLAY',
      response: {
        statusCode: typeof existing.statusCode === 'number' ? existing.statusCode : 200,
        body: JSON.parse(existing.responseJson) as T,
      },
    };
  }

  return { state: 'IN_PROGRESS' };
}

export async function completeIdempotentOperation(params: {
  scope: string;
  key: string;
  statusCode: number;
  body: unknown;
}): Promise<void> {
  const db = await getPaymentsMongoDb();
  await db.collection('pay_idempotency').updateOne(
    { scope: params.scope, key: params.key },
    {
      $set: {
        status: 'COMPLETED',
        statusCode: params.statusCode,
        responseJson: JSON.stringify(params.body),
        updatedAt: new Date(),
      },
    }
  );
}

export async function failIdempotentOperation(params: {
  scope: string;
  key: string;
}): Promise<void> {
  const db = await getPaymentsMongoDb();
  await db.collection('pay_idempotency').deleteOne({
    scope: params.scope,
    key: params.key,
    status: 'IN_PROGRESS',
  });
}
