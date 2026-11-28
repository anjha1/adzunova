import crypto from 'node:crypto';
import { ObjectId } from 'mongodb';
import { getStorageMongoDb } from './client';

/**
 * Append-Only Repository for storage_asset_events.
 * Intentionally exposes ONLY insert() and findByAssetId() — NO update or delete methods.
 */
export class AppendOnlyAssetEventRepository {
  async insert(input: {
    assetId: string;
    eventType: string;
    actorId: string;
    ownerType: string;
    ownerId: string;
    tenantId: string;
    visibility: string;
    payload: Record<string, unknown>;
  }): Promise<{ id: string; eventHash: string }> {
    const db = await getStorageMongoDb();
    const col = db.collection('storage_asset_events');
    const assetOid = new ObjectId(input.assetId);

    const lastEvent = await col
      .find({ assetId: assetOid })
      .sort({ createdAt: -1, _id: -1 })
      .limit(1)
      .toArray();
    const previousHash = lastEvent[0]?.eventHash || null;
    const payloadJson = JSON.stringify(input.payload);
    const createdAt = new Date();
    const eventHash = crypto
      .createHash('sha256')
      .update(`${previousHash || 'GENESIS'}|${input.assetId}|${input.eventType}|${payloadJson}|${createdAt.toISOString()}`)
      .digest('hex');

    const res = await col.insertOne({
      assetId: assetOid,
      eventType: input.eventType,
      actorId: input.actorId,
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      tenantId: input.tenantId,
      visibility: input.visibility,
      payloadJson,
      previousHash,
      eventHash,
      createdAt,
    });

    return { id: res.insertedId.toHexString(), eventHash };
  }

  async findByAssetId(assetId: string, limit = 50) {
    const db = await getStorageMongoDb();
    return db
      .collection('storage_asset_events')
      .find({ assetId: new ObjectId(assetId) })
      .sort({ createdAt: 1, _id: 1 })
      .limit(Math.min(limit, 200))
      .toArray();
  }

  async verifyHashChain(assetId: string): Promise<{ valid: boolean; checked: number; brokenAtId?: string }> {
    const events = await this.findByAssetId(assetId, 200);
    let expectedPrev: string | null = null;
    for (const ev of events) {
      if ((ev.previousHash || null) !== expectedPrev) {
        return { valid: false, checked: events.length, brokenAtId: String(ev._id) };
      }
      const recomputed = crypto
        .createHash('sha256')
        .update(`${expectedPrev || 'GENESIS'}|${assetId}|${ev.eventType}|${ev.payloadJson}|${new Date(ev.createdAt).toISOString()}`)
        .digest('hex');
      if (recomputed !== ev.eventHash) {
        return { valid: false, checked: events.length, brokenAtId: String(ev._id) };
      }
      expectedPrev = ev.eventHash;
    }
    return { valid: true, checked: events.length };
  }
}

/**
 * Atomic Blob Reference Counting & Two-Phase Deletion.
 * Conditional $inc ensures refCount can never drop below 0.
 */
export async function incrementBlobRefCount(blobId: string): Promise<number> {
  const db = await getStorageMongoDb();
  const res = await db.collection('storage_asset_blobs').findOneAndUpdate(
    { _id: new ObjectId(blobId), state: 'ACTIVE' },
    { $inc: { refCount: 1 }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  if (!res) throw new Error(`Active blob not found: ${blobId}`);
  return Number(res.refCount);
}

export async function decrementBlobRefCountAndMaybeTombstone(
  blobId: string,
  graceWindowMs = 24 * 3600 * 1000
): Promise<{ refCount: number; tombstoned: boolean }> {
  const db = await getStorageMongoDb();
  const col = db.collection('storage_asset_blobs');
  const oid = new ObjectId(blobId);

  // Conditional atomic decrement: refCount can NEVER go below 0
  const updated = await col.findOneAndUpdate(
    { _id: oid, refCount: { $gt: 0 } },
    { $inc: { refCount: -1 }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!updated) {
    return { refCount: 0, tombstoned: false };
  }

  if (updated.refCount === 0 && updated.state === 'ACTIVE') {
    const now = new Date();
    await col.updateOne(
      { _id: oid, refCount: 0, state: 'ACTIVE' },
      { $set: { state: 'TOMBSTONED', tombstonedAt: now, purgeAfter: new Date(now.getTime() + graceWindowMs), updatedAt: now } }
    );
    return { refCount: 0, tombstoned: true };
  }

  return { refCount: Number(updated.refCount), tombstoned: false };
}

export async function reconcileBlobRefCounts(): Promise<{
  checked: number;
  drifts: Array<{ blobId: string; storedRefCount: number; actualLinks: number }>;
}> {
  const db = await getStorageMongoDb();
  const blobs = await db.collection('storage_asset_blobs').find({ state: { $ne: 'PURGED' } }).limit(500).toArray();
  const drifts: Array<{ blobId: string; storedRefCount: number; actualLinks: number }> = [];

  for (const b of blobs) {
    const actualLinks = await db.collection('storage_asset_links').countDocuments({ blobId: b._id });
    if (Number(b.refCount) !== actualLinks) {
      drifts.push({ blobId: String(b._id), storedRefCount: Number(b.refCount), actualLinks });
    }
  }
  return { checked: blobs.length, drifts };
}
