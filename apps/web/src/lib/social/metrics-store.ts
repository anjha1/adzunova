/**
 * Time Series Metric Storage & Aggregations (L0 In-Memory / L1 MongoDB Atlas / L2 PostgreSQL)
 */

import { Pool } from 'pg';
import { DerivedAudienceMetrics } from './demographics-engine';
import type { Db, MongoClient } from 'mongodb';

let mongoClient: MongoClient | null = null;
let mongoDbPromise: Promise<Db | null> | null = null;

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
      return db;
    } catch (err: any) {
      console.warn('[MetricsStore] MongoDB connection skipped/failed, using next layer:', err.message);
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

export interface MetricPoint {
  accountId: string;
  metric: string; // e.g. 'views', 'followers', 'media_count', 'impressions'
  timestamp: Date;
  value: number;
  dimensions?: Record<string, any>;
}

export interface MetricSeriesResult {
  metric: string;
  points: { timestamp: string; value: number; dimensions?: Record<string, any> }[];
}

// In-Memory Time Series Storage (Fallback & Unit Test Sandbox)
const inMemoryMetricPoints: MetricPoint[] = [];
const inMemoryDemographicsSnapshots = new Map<string, DerivedAudienceMetrics>();

let pgPool: Pool | null = null;
let tablesInitialized = false;

function getPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return null;

  if (!pgPool) {
    pgPool = new Pool({
      connectionString: dbUrl,
      max: 10,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pgPool;
}

/**
 * Initializes the social_metric_points table if Postgres is configured
 */
export async function initMetricsTables(): Promise<void> {
  const pool = getPool();
  if (!pool || tablesInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_metric_points (
        account_id VARCHAR(64) NOT NULL,
        metric VARCHAR(64) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        value NUMERIC(16, 2) NOT NULL,
        dimensions JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (account_id, metric, timestamp)
      );

      CREATE TABLE IF NOT EXISTS social_audience_snapshots (
        account_id VARCHAR(64) PRIMARY KEY,
        snapshot_data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_metric_points_lookup ON social_metric_points(account_id, metric, timestamp DESC);
    `);
    tablesInitialized = true;
  } catch (err) {
    console.warn('[MetricsStore] Postgres init failed, falling back to in-memory store:', err);
  }
}

/**
 * Inserts or updates metric points with idempotency
 */
export async function upsertMetricPoints(points: MetricPoint[]): Promise<number> {
  if (points.length === 0) return 0;

  const mongoDb = await getMongoDb();
  if (mongoDb) {
    const ops = points.map((pt) => ({
      updateOne: {
        filter: { accountId: pt.accountId, metric: pt.metric, timestamp: pt.timestamp },
        update: {
          $set: {
            accountId: pt.accountId,
            metric: pt.metric,
            timestamp: pt.timestamp,
            value: pt.value,
            dimensions: pt.dimensions || {},
          },
        },
        upsert: true,
      },
    }));
    await mongoDb.collection('social_metric_points').bulkWrite(ops);
    return points.length;
  }

  const pool = getPool();
  if (pool) {
    await initMetricsTables();
    let inserted = 0;
    for (const pt of points) {
      await pool.query(
        `INSERT INTO social_metric_points (account_id, metric, timestamp, value, dimensions)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (account_id, metric, timestamp)
         DO UPDATE SET value = EXCLUDED.value, dimensions = EXCLUDED.dimensions`,
        [pt.accountId, pt.metric, pt.timestamp, pt.value, JSON.stringify(pt.dimensions || {})]
      );
      inserted++;
    }
    return inserted;
  }

  // In-memory fallback
  for (const pt of points) {
    const existingIndex = inMemoryMetricPoints.findIndex(
      (p) =>
        p.accountId === pt.accountId &&
        p.metric === pt.metric &&
        p.timestamp.getTime() === pt.timestamp.getTime()
    );

    if (existingIndex >= 0) {
      inMemoryMetricPoints[existingIndex] = pt;
    } else {
      inMemoryMetricPoints.push(pt);
    }
  }

  return points.length;
}

/**
 * Queries time-series metric points for an account
 */
export async function getMetricSeries(
  accountId: string,
  metric: string,
  from: Date,
  to: Date
): Promise<MetricSeriesResult> {
  const mongoDb = await getMongoDb();
  if (mongoDb) {
    const docs = await mongoDb
      .collection('social_metric_points')
      .find({
        accountId,
        metric,
        timestamp: { $gte: from, $lte: to },
      })
      .sort({ timestamp: 1 })
      .toArray();

    return {
      metric,
      points: docs.map((doc: any) => ({
        timestamp: new Date(doc.timestamp).toISOString(),
        value: Number(doc.value),
        dimensions: doc.dimensions,
      })),
    };
  }

  const pool = getPool();
  if (pool) {
    await initMetricsTables();
    const res = await pool.query(
      `SELECT timestamp, value, dimensions
       FROM social_metric_points
       WHERE account_id = $1 AND metric = $2 AND timestamp >= $3 AND timestamp <= $4
       ORDER BY timestamp ASC`,
      [accountId, metric, from, to]
    );

    return {
      metric,
      points: res.rows.map((r) => ({
        timestamp: new Date(r.timestamp).toISOString(),
        value: Number(r.value),
        dimensions: r.dimensions,
      })),
    };
  }

  // In-memory fallback
  const filtered = inMemoryMetricPoints
    .filter(
      (p) =>
        p.accountId === accountId &&
        p.metric === metric &&
        p.timestamp.getTime() >= from.getTime() &&
        p.timestamp.getTime() <= to.getTime()
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((p) => ({
      timestamp: p.timestamp.toISOString(),
      value: p.value,
      dimensions: p.dimensions,
    }));

  return {
    metric,
    points: filtered,
  };
}

/**
 * Saves latest audience demographics snapshot
 */
export async function saveAudienceSnapshot(
  accountId: string,
  snapshot: DerivedAudienceMetrics
): Promise<void> {
  const mongoDb = await getMongoDb();
  if (mongoDb) {
    await mongoDb.collection('social_audience_snapshots').updateOne(
      { account_id: accountId },
      { $set: { snapshot_data: snapshot, updated_at: new Date() } },
      { upsert: true }
    );
    return;
  }

  const pool = getPool();
  if (pool) {
    await initMetricsTables();
    await pool.query(
      `INSERT INTO social_audience_snapshots (account_id, snapshot_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (account_id)
       DO UPDATE SET snapshot_data = EXCLUDED.snapshot_data, updated_at = NOW()`,
      [accountId, JSON.stringify(snapshot)]
    );
    return;
  }

  inMemoryDemographicsSnapshots.set(accountId, snapshot);
}

/**
 * Retrieves latest audience demographics snapshot
 */
export async function getLatestAudienceSnapshot(
  accountId: string
): Promise<DerivedAudienceMetrics | null> {
  const mongoDb = await getMongoDb();
  if (mongoDb) {
    const doc = await mongoDb.collection('social_audience_snapshots').findOne({ account_id: accountId });
    if (doc && doc.snapshot_data) {
      return doc.snapshot_data as DerivedAudienceMetrics;
    }
  }

  const pool = getPool();
  if (pool) {
    await initMetricsTables();
    const res = await pool.query(
      `SELECT snapshot_data FROM social_audience_snapshots WHERE account_id = $1`,
      [accountId]
    );
    if (res.rows.length > 0) {
      return res.rows[0].snapshot_data as DerivedAudienceMetrics;
    }
    return null;
  }

  return inMemoryDemographicsSnapshots.get(accountId) || null;
}

/**
 * Clears in-memory storage (for testing only)
 */
export function _resetInMemoryMetrics(): void {
  inMemoryMetricPoints.length = 0;
  inMemoryDemographicsSnapshots.clear();
}
