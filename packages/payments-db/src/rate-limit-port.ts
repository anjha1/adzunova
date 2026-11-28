import { getPaymentsMongoDb } from './client';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
}

export interface RateLimitPort {
  consume(bucketKey: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
}

export class MongoRateLimitAdapter implements RateLimitPort {
  async consume(
    bucketKey: string,
    limit: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const db = await getPaymentsMongoDb();
    const now = new Date();
    const windowMs = windowSeconds * 1000;
    const windowId = Math.floor(now.getTime() / windowMs);
    const fullKey = `${bucketKey}:${windowId}`;
    const resetAt = new Date((windowId + 1) * windowMs);

    const res = await db.collection<{
      bucketKey: string;
      count: number;
      expiresAt: Date;
    }>('pay_rate_limit_buckets').findOneAndUpdate(
      { bucketKey: fullKey },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: resetAt },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const count = res?.count ?? 1;
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
      resetAt,
    };
  }
}

/**
 * Atomic per-day call cap for Razorpay live_probe mode.
 */
export async function consumeDailyProbeQuota(
  provider: string,
  maxCallsPerDay: number
): Promise<{ allowed: boolean; count: number; maxCallsPerDay: number; dayKey: string }> {
  const db = await getPaymentsMongoDb();
  const day = new Date().toISOString().slice(0, 10);
  const dayKey = `${day}:${provider}`;
  const now = new Date();
  const col = db.collection<{
    dayKey: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
  }>('pay_daily_probe_counters');

  try {
    await col.insertOne({ dayKey, count: 0, createdAt: now, updatedAt: now });
  } catch (err: unknown) {
    const mongoErr = err as { code?: number };
    if (mongoErr?.code !== 11000) throw err;
  }

  const res = await col.findOneAndUpdate(
    { dayKey, count: { $lt: maxCallsPerDay } },
    { $inc: { count: 1 }, $set: { updatedAt: now } },
    { returnDocument: 'after' }
  );

  if (!res) {
    const existing = await col.findOne({ dayKey });
    return {
      allowed: false,
      count: typeof existing?.count === 'number' ? existing.count : maxCallsPerDay,
      maxCallsPerDay,
      dayKey,
    };
  }

  return {
    allowed: true,
    count: res.count,
    maxCallsPerDay,
    dayKey,
  };
}
