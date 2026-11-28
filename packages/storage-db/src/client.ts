import { PrismaClient } from '../generated/client/index.js';
import { MongoClient } from 'mongodb';

const globalForStorageDb = globalThis as unknown as {
  storagePrisma?: PrismaClient;
  storageMongoClient?: MongoClient;
};

export function getStorageMongoDbName(): string {
  return process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage';
}

export function getStoragePrisma(): PrismaClient {
  if (!process.env.MONGODB_URI) {
    throw new Error('Storage metadata database not configured: MONGODB_URI is missing');
  }
  if (!globalForStorageDb.storagePrisma) {
    globalForStorageDb.storagePrisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return globalForStorageDb.storagePrisma;
}

export async function getStorageMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Storage metadata database not configured: MONGODB_URI is missing');
  }
  if (!globalForStorageDb.storageMongoClient) {
    globalForStorageDb.storageMongoClient = new MongoClient(uri, {
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 15000,
    });
    await globalForStorageDb.storageMongoClient.connect();
  }
  return globalForStorageDb.storageMongoClient.db(getStorageMongoDbName());
}

export async function checkStorageMetadataHealth(): Promise<{
  configured: boolean;
  reachable: boolean;
  reason?: string;
}> {
  if (!process.env.MONGODB_URI) {
    return {
      configured: false,
      reachable: false,
      reason: 'Storage metadata database not configured',
    };
  }
  try {
    const db = await getStorageMongoDb();
    await db.command({ ping: 1 });
    return { configured: true, reachable: true };
  } catch (err) {
    return {
      configured: true,
      reachable: false,
      reason: err instanceof Error ? 'Storage metadata database unreachable' : 'Storage metadata database unreachable',
    };
  }
}
