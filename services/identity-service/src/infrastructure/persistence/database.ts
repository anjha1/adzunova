import { MongoClient, Db } from 'mongodb';
import { IDatabaseStore, InMemoryDatabaseStore } from './in-memory-db';

let client: MongoClient | null = null;
let dbInstance: IDatabaseStore | null = null;
const inMemoryFallback = new InMemoryDatabaseStore();

export interface DatabaseStatus {
  state: 'connecting' | 'connected' | 'fallback';
  type: 'mongo' | 'in-memory-fallback';
  connectDurationMs?: number;
  error?: string;
}

let currentStatus: DatabaseStatus = {
  state: 'connecting',
  type: 'in-memory-fallback',
};

export function getDatabaseStatus(): DatabaseStatus {
  return currentStatus;
}

export async function getDatabase(): Promise<IDatabaseStore> {
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGODB_URI;
  const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';

  if (uri && !uri.includes('USER:PASSWORD')) {
    const startConnect = Date.now();
    try {
      if (!client) {
        client = new MongoClient(uri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: isDev ? 1500 : 5000,
          connectTimeoutMS: isDev ? 1500 : 5000,
          socketTimeoutMS: 10000,
        });
        await client.connect();
      }
      const dbName = process.env.MONGODB_DB_NAME || 'adzunova_identity';
      const realDb = client.db(dbName);
      await ensureIndexes(realDb);
      dbInstance = realDb as unknown as IDatabaseStore;

      currentStatus = {
        state: 'connected',
        type: 'mongo',
        connectDurationMs: Date.now() - startConnect,
      };
      return dbInstance;
    } catch (err: any) {
      console.warn(`[database] MongoDB connection failed (${err.message}).`);
      if (client) {
        try { await client.close(); } catch {}
        client = null;
      }

      if (!isDev) {
        currentStatus = {
          state: 'fallback',
          type: 'in-memory-fallback',
          error: err.message,
        };
        throw new Error(`Production requires valid MongoDB cluster. Connection failed: ${err.message}`);
      }

      console.warn('[database] Operating with resilient in-memory datastore (development mode).');
      dbInstance = inMemoryFallback;
      currentStatus = {
        state: 'fallback',
        type: 'in-memory-fallback',
        connectDurationMs: Date.now() - startConnect,
        error: err.message,
      };
      return dbInstance;
    }
  }

  console.log('[database] Operating with enterprise in-memory datastore.');
  dbInstance = inMemoryFallback;
  currentStatus = {
    state: 'fallback',
    type: 'in-memory-fallback',
  };
  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    dbInstance = null;
    currentStatus = { state: 'connecting', type: 'in-memory-fallback' };
    console.log('[database] MongoDB connection closed.');
  }
}

async function ensureIndexes(db: Db): Promise<void> {
  // 1. Users collection
  const users = db.collection('users');
  await users.createIndex({ normalizedEmail: 1 }, { unique: true });
  await users.createIndex({ status: 1 });

  // 2. Identities collection (for OAuth linking & multi-provider)
  const identities = db.collection('identities');
  await identities.createIndex({ provider: 1, providerUserId: 1 }, { unique: true });
  await identities.createIndex({ userId: 1 });
  await identities.createIndex({ providerEmail: 1 });

  // 3. Creator Profiles collection
  const creatorProfiles = db.collection('creator_profiles');
  await creatorProfiles.createIndex({ userId: 1 }, { unique: true });
  await creatorProfiles.createIndex({ category: 1 });

  // 4. Brand Profiles collection
  const brandProfiles = db.collection('brand_profiles');
  await brandProfiles.createIndex({ userId: 1 }, { unique: true });
  await brandProfiles.createIndex({ businessType: 1 });

  // 5. Sessions collection with TTL
  const sessions = db.collection('sessions');
  await sessions.createIndex({ sessionTokenHash: 1 }, { unique: true });
  await sessions.createIndex({ userId: 1 });
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // 6. Verification Tokens collection with TTL
  const verificationTokens = db.collection('verification_tokens');
  await verificationTokens.createIndex({ tokenHash: 1 }, { unique: true });
  await verificationTokens.createIndex({ userId: 1, purpose: 1 });
  await verificationTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
