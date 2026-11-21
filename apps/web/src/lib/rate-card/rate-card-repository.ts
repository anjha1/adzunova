import crypto from 'crypto';
import type { Db, MongoClient } from 'mongodb';
import {
  RateCardItem,
  RateCardStatus,
  RateCardPlatform,
  ContentFormat,
  DeliverableType,
} from './types';

export interface RateCardAuditLog {
  id: string;
  creatorId: string;
  itemId: string;
  action: 'CREATE' | 'UPDATE' | 'DUPLICATE' | 'STATUS_CHANGE' | 'REORDER' | 'DELETE';
  previousState?: Partial<RateCardItem> | null;
  newState?: Partial<RateCardItem> | null;
  timestamp: string;
}

// In-Memory Storage Adapter (for isolated unit tests & fallback)
const inMemoryItems = new Map<string, RateCardItem>();
const inMemoryAuditLogs: RateCardAuditLog[] = [];

let mongoClient: MongoClient | null = null;
let mongoDbPromise: Promise<Db | null> | null = null;
let mongoIndexesEnsured = false;

async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USER:PASSWORD')) return null;
  if (mongoDbPromise) return mongoDbPromise;

  mongoDbPromise = (async () => {
    try {
      if (!mongoClient) {
        const { MongoClient } = await import('mongodb');
        mongoClient = new MongoClient(uri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          socketTimeoutMS: 10000,
        });
        await mongoClient.connect();
      }
      const db = mongoClient.db(process.env.MONGODB_DB_NAME || 'adzunova');
      if (!mongoIndexesEnsured) {
        await Promise.allSettled([
          db.collection('rate_card_items').createIndex({ id: 1 }, { unique: true, background: true }),
          db.collection('rate_card_items').createIndex({ creatorId: 1, deletedAt: 1, sortOrder: 1 }, { background: true }),
          db.collection('rate_card_items').createIndex({ creatorId: 1, status: 1, platform: 1, price: 1 }, { background: true }),
          db.collection('rate_card_audit_logs').createIndex({ creatorId: 1, timestamp: -1 }, { background: true }),
        ]);
        mongoIndexesEnsured = true;
      }
      return db;
    } catch (err: any) {
      console.warn('[RateCardRepo] MongoDB connection failed/skipped, using in-memory store:', err.message);
      if (mongoClient) {
        try {
          await mongoClient.close();
        } catch {}
        mongoClient = null;
      }
      mongoDbPromise = null;
      return null;
    }
  })();

  return mongoDbPromise;
}


export async function logRateCardAudit(log: Omit<RateCardAuditLog, 'id' | 'timestamp'>): Promise<void> {
  const fullLog: RateCardAuditLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('rate_card_audit_logs').insertOne(fullLog);
      return;
    } catch (err: any) {
      console.warn('[RateCardRepo] Failed to write audit log to Mongo:', err.message);
    }
  }

  inMemoryAuditLogs.push(fullLog);
}

export async function getRateCardItems(
  creatorId: string,
  options?: {
    platform?: RateCardPlatform;
    contentFormat?: ContentFormat;
    status?: RateCardStatus;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'custom';
  }
): Promise<RateCardItem[]> {
  const db = await getMongoDb();

  let items: RateCardItem[] = [];

  if (db) {
    const filter: any = {
      creatorId,
      deletedAt: null,
    };

    if (options?.platform) filter.platform = options.platform;
    if (options?.contentFormat) filter.contentFormat = options.contentFormat;
    if (options?.status) filter.status = options.status;

    let cursor = db.collection('rate_card_items').find(filter);

    if (options?.sortBy === 'price_asc') {
      cursor = cursor.sort({ price: 1 });
    } else if (options?.sortBy === 'price_desc') {
      cursor = cursor.sort({ price: -1 });
    } else if (options?.sortBy === 'newest') {
      cursor = cursor.sort({ createdAt: -1 });
    } else {
      cursor = cursor.sort({ sortOrder: 1, createdAt: -1 });
    }

    const docs = await cursor.toArray();
    items = docs.map((doc: any) => {
      const { _id, ...rest } = doc;
      return rest as RateCardItem;
    });
  } else {
    // In-memory fallback
    items = Array.from(inMemoryItems.values()).filter(
      (item) => item.creatorId === creatorId && item.deletedAt === null
    );

    if (options?.platform) {
      items = items.filter((i) => i.platform === options.platform);
    }
    if (options?.contentFormat) {
      items = items.filter((i) => i.contentFormat === options.contentFormat);
    }
    if (options?.status) {
      items = items.filter((i) => i.status === options.status);
    }

    if (options?.sortBy === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (options?.sortBy === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (options?.sortBy === 'newest') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      items.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  }

  // Filter by search query if provided
  if (options?.search && options.search.trim().length > 0) {
    const q = options.search.toLowerCase().trim();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.platform.toLowerCase().includes(q) ||
        i.contentFormat.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function getRateCardItemById(
  creatorId: string,
  id: string
): Promise<RateCardItem | null> {
  const db = await getMongoDb();
  if (db) {
    const doc = await db.collection('rate_card_items').findOne({
      id,
      creatorId,
      deletedAt: null,
    });
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return rest as RateCardItem;
  }

  const item = inMemoryItems.get(id);
  if (!item || item.creatorId !== creatorId || item.deletedAt !== null) {
    return null;
  }
  return item;
}

export async function createRateCardItem(
  creatorId: string,
  data: Omit<RateCardItem, 'id' | 'creatorId' | 'version' | 'createdAt' | 'updatedAt' | 'deletedAt'>
): Promise<RateCardItem> {
  const db = await getMongoDb();

  // Enforce maximum 50 items per creator limit
  const currentItems = await getRateCardItems(creatorId);
  if (currentItems.length >= 50) {
    throw new Error('Maximum limit of 50 rate card deliverables reached');
  }

  const now = new Date().toISOString();
  const newItem: RateCardItem = {
    ...data,
    id: crypto.randomUUID(),
    creatorId,
    version: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    sortOrder: data.sortOrder ?? currentItems.length,
  };

  if (db) {
    await db.collection('rate_card_items').insertOne(newItem);
  } else {
    inMemoryItems.set(newItem.id, newItem);
  }

  await logRateCardAudit({
    creatorId,
    itemId: newItem.id,
    action: 'CREATE',
    newState: newItem,
  });

  return newItem;
}

export async function updateRateCardItem(
  creatorId: string,
  id: string,
  updates: Partial<Omit<RateCardItem, 'id' | 'creatorId' | 'createdAt' | 'deletedAt'>>,
  expectedVersion?: number
): Promise<RateCardItem> {
  const existing = await getRateCardItemById(creatorId, id);
  if (!existing) {
    throw new Error('Rate card deliverable not found');
  }

  // Optimistic concurrency check
  if (expectedVersion !== undefined && existing.version !== expectedVersion) {
    const error: any = new Error(
      `Concurrency conflict: Deliverable was modified by another session (expected version ${expectedVersion}, got ${existing.version})`
    );
    error.status = 409;
    throw error;
  }

  // Enforce ₹0 active rule
  const nextStatus = updates.status ?? existing.status;
  const nextPrice = updates.price !== undefined ? updates.price : existing.price;
  if (nextStatus === 'ACTIVE' && nextPrice <= 0) {
    const error: any = new Error('Active deliverables must have a price greater than ₹0');
    error.status = 400;
    throw error;
  }

  const now = new Date().toISOString();
  const updatedItem: RateCardItem = {
    ...existing,
    ...updates,
    version: existing.version + 1,
    updatedAt: now,
  };

  const db = await getMongoDb();
  if (db) {
    await db.collection('rate_card_items').updateOne(
      { id, creatorId },
      { $set: updatedItem }
    );
  } else {
    inMemoryItems.set(id, updatedItem);
  }

  await logRateCardAudit({
    creatorId,
    itemId: id,
    action: 'UPDATE',
    previousState: existing,
    newState: updatedItem,
  });

  return updatedItem;
}

export async function duplicateRateCardItem(
  creatorId: string,
  id: string
): Promise<RateCardItem> {
  const existing = await getRateCardItemById(creatorId, id);
  if (!existing) {
    throw new Error('Rate card deliverable not found');
  }

  const { id: _oldId, version: _v, createdAt: _c, updatedAt: _u, deletedAt: _d, ...rest } = existing;
  const now = new Date().toISOString();

  const duplicatedItem: RateCardItem = {
    ...rest,
    id: crypto.randomUUID(),
    creatorId,
    title: `${existing.title} - Copy`.slice(0, 80),
    status: 'DRAFT',
    version: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    addons: existing.addons.map((a) => ({ ...a, id: crypto.randomUUID() })),
  };

  const db = await getMongoDb();
  if (db) {
    await db.collection('rate_card_items').insertOne(duplicatedItem);
  } else {
    inMemoryItems.set(duplicatedItem.id, duplicatedItem);
  }

  await logRateCardAudit({
    creatorId,
    itemId: duplicatedItem.id,
    action: 'DUPLICATE',
    previousState: { id: existing.id, title: existing.title },
    newState: duplicatedItem,
  });

  return duplicatedItem;
}

export async function softDeleteRateCardItem(
  creatorId: string,
  id: string
): Promise<boolean> {
  const existing = await getRateCardItemById(creatorId, id);
  if (!existing) {
    throw new Error('Rate card deliverable not found');
  }

  const now = new Date().toISOString();
  const db = await getMongoDb();
  if (db) {
    await db.collection('rate_card_items').updateOne(
      { id, creatorId },
      { $set: { deletedAt: now, updatedAt: now } }
    );
  } else {
    existing.deletedAt = now;
    existing.updatedAt = now;
    inMemoryItems.set(id, existing);
  }

  await logRateCardAudit({
    creatorId,
    itemId: id,
    action: 'DELETE',
    previousState: existing,
    newState: { deletedAt: now },
  });

  return true;
}

export async function reorderRateCardItems(
  creatorId: string,
  orderedIds: string[]
): Promise<void> {
  const db = await getMongoDb();
  const now = new Date().toISOString();

  if (db) {
    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { id, creatorId, deletedAt: null },
        update: { $set: { sortOrder: index, updatedAt: now } },
      },
    }));
    if (operations.length > 0) {
      await db.collection('rate_card_items').bulkWrite(operations);
    }
  } else {
    orderedIds.forEach((id, index) => {
      const item = inMemoryItems.get(id);
      if (item && item.creatorId === creatorId && !item.deletedAt) {
        item.sortOrder = index;
        item.updatedAt = now;
        inMemoryItems.set(id, item);
      }
    });
  }

  await logRateCardAudit({
    creatorId,
    itemId: 'batch-reorder',
    action: 'REORDER',
    newState: { orderedIds } as any,
  });
}
