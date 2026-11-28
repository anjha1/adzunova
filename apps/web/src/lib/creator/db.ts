import { MongoClient, type Db } from 'mongodb';
import { AppProblemError } from '@adzunova/problem-details';

let client: MongoClient | null = null;
let dbPromise: Promise<Db> | null = null;
let indexesEnsured = false;

export async function getCreatorMongoDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USER:PASSWORD')) {
    throw new AppProblemError({
      status: 503,
      code: 'CREATOR_DB_UNCONFIGURED',
      title: 'Database Unavailable',
      detail: 'MONGODB_URI is not configured for creator persistence.',
    });
  }

  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    if (!client) {
      client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      });
      await client.connect();
    }
    const dbName = process.env.CREATOR_MONGODB_DB_NAME || process.env.MONGODB_DB_NAME || 'adzunova';
    const db = client.db(dbName);

    if (!indexesEnsured) {
      await Promise.all([
        db.collection('creator_packages').createIndex({ id: 1 }, { unique: true }),
        db
          .collection('creator_packages')
          .createIndex(
            { creatorId: 1, name: 1 },
            { unique: true, partialFilterExpression: { deletedAt: null } }
          ),
        db
          .collection('creator_packages')
          .createIndex({ creatorId: 1, isActive: 1, deletedAt: 1, updatedAt: -1 }),
        db
          .collection('creator_availability')
          .createIndex({ creatorId: 1, year: 1, month: 1 }, { unique: true }),
      ]);
      indexesEnsured = true;
    }

    return db;
  })().catch((err) => {
    dbPromise = null;
    throw err;
  });

  return dbPromise;
}

export async function closeCreatorMongoDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    dbPromise = null;
    indexesEnsured = false;
  }
}
