import { PrismaClient } from '../generated/client/index.js';
import { MongoClient, type Db } from 'mongodb';

const globalForPaymentsDb = globalThis as unknown as {
  paymentsPrisma?: PrismaClient;
  paymentsMongoClient?: MongoClient;
};

export function getPaymentsMongoDbName(): string {
  return process.env.PAYMENTS_MONGODB_DB_NAME || 'adzunova_payments';
}

function buildPaymentsPrismaUrl(rawUri: string): string {
  const dbName = getPaymentsMongoDbName();
  try {
    const url = new URL(rawUri);
    url.pathname = `/${dbName}`;
    return url.toString();
  } catch {
    return rawUri;
  }
}

export function getPaymentsPrisma(): PrismaClient {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    throw new Error('Payments database not configured: MONGODB_URI is missing');
  }
  if (!globalForPaymentsDb.paymentsPrisma) {
    globalForPaymentsDb.paymentsPrisma = new PrismaClient({
      datasources: {
        db: { url: buildPaymentsPrismaUrl(rawUri) },
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return globalForPaymentsDb.paymentsPrisma;
}

export async function getPaymentsMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Payments database not configured: MONGODB_URI is missing');
  }
  if (!globalForPaymentsDb.paymentsMongoClient) {
    globalForPaymentsDb.paymentsMongoClient = new MongoClient(uri, {
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 15000,
    });
    await globalForPaymentsDb.paymentsMongoClient.connect();
  }
  return globalForPaymentsDb.paymentsMongoClient;
}

export async function getPaymentsMongoDb(): Promise<Db> {
  const client = await getPaymentsMongoClient();
  return client.db(getPaymentsMongoDbName());
}

export async function checkPaymentsHealth(): Promise<{
  configured: boolean;
  reachable: boolean;
  dbName: string;
  reason?: string;
}> {
  const dbName = getPaymentsMongoDbName();
  if (!process.env.MONGODB_URI) {
    return {
      configured: false,
      reachable: false,
      dbName,
      reason: 'Payments database not configured',
    };
  }
  try {
    const db = await getPaymentsMongoDb();
    await db.command({ ping: 1 });
    return { configured: true, reachable: true, dbName };
  } catch {
    return {
      configured: true,
      reachable: false,
      dbName,
      reason: 'Payments database unreachable',
    };
  }
}

export async function closePaymentsDb(): Promise<void> {
  if (globalForPaymentsDb.paymentsPrisma) {
    await globalForPaymentsDb.paymentsPrisma.$disconnect().catch(() => {});
    globalForPaymentsDb.paymentsPrisma = undefined;
  }
  if (globalForPaymentsDb.paymentsMongoClient) {
    await globalForPaymentsDb.paymentsMongoClient.close().catch(() => {});
    globalForPaymentsDb.paymentsMongoClient = undefined;
  }
}
