import { Pool } from 'pg';
import crypto from 'crypto';

export interface SocialAccount {
  id: string;
  creator_id: string;
  provider: 'instagram';
  provider_user_id: string;
  username: string;
  account_type: string;
  profile_picture_url: string | null;
  followers_count: number;
  media_count: number;
  status: 'ACTIVE' | 'RECONNECT_REQUIRED' | 'REVOKED' | 'SUSPENDED';
  scopes: string[];
  capabilities: Record<string, any>;
  connected_at: Date;
  last_synced_at: Date | null;
  next_sync_at: Date | null;
  sync_tier: 'HOT' | 'WARM' | 'COLD';
  failure_count: number;
}

export interface SocialCredential {
  account_id: string;
  token_ciphertext: string;
  token_nonce: string;
  key_id: string;
  token_type: string;
  expires_at: Date | null;
  created_at: Date;
  rotated_at: Date | null;
}

export interface DataDeletionRequest {
  confirmation_code: string;
  provider: string;
  provider_user_id: string;
  status: 'PENDING' | 'COMPLETED';
  requested_at: Date;
  completed_at: Date | null;
}

export interface OutboxEvent {
  id: string;
  event_type: string;
  aggregate_id: string;
  payload: Record<string, any>;
  created_at: Date;
  processed: boolean;
}

export interface SocialAuditLog {
  id: string;
  creator_id: string;
  action: 'CONNECT_INITIATED' | 'CONNECT_SUCCESS' | 'DISCONNECTED' | 'SYNC_FAILURE' | 'TOKEN_INVALIDATED' | 'CAPABILITY_CHANGED' | 'DATA_DELETED';
  provider: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

// In-Memory Storage Adapter (Development / Test Fallback)
const inMemoryAccounts = new Map<string, SocialAccount>();
const inMemoryCredentials = new Map<string, SocialCredential>();
const inMemoryDeletions = new Map<string, DataDeletionRequest>();
const inMemoryAuditLogs: SocialAuditLog[] = [];
const inMemoryOutbox: OutboxEvent[] = [];

// Postgres Pool Setup
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
 * Initializes database tables if Postgres is configured
 */
export async function initSocialDbTables(): Promise<void> {
  const pool = getPool();
  if (!pool || tablesInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_accounts (
        id VARCHAR(64) PRIMARY KEY,
        creator_id VARCHAR(64) NOT NULL,
        provider VARCHAR(32) NOT NULL,
        provider_user_id VARCHAR(128) NOT NULL,
        username VARCHAR(128) NOT NULL,
        account_type VARCHAR(32) NOT NULL,
        profile_picture_url TEXT,
        followers_count BIGINT NOT NULL DEFAULT 0,
        media_count INT NOT NULL DEFAULT 0,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        scopes TEXT[] DEFAULT '{}',
        capabilities JSONB DEFAULT '{}',
        connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_synced_at TIMESTAMPTZ,
        next_sync_at TIMESTAMPTZ,
        sync_tier VARCHAR(16) NOT NULL DEFAULT 'WARM',
        failure_count INT NOT NULL DEFAULT 0,
        CONSTRAINT uq_social_provider_account UNIQUE(provider, provider_user_id)
      );

      CREATE TABLE IF NOT EXISTS social_credentials (
        account_id VARCHAR(64) PRIMARY KEY REFERENCES social_accounts(id) ON DELETE CASCADE,
        token_ciphertext TEXT NOT NULL,
        token_nonce VARCHAR(64) NOT NULL,
        key_id VARCHAR(32) NOT NULL DEFAULT 'v1',
        token_type VARCHAR(32) NOT NULL,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        rotated_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS social_data_deletion_requests (
        confirmation_code VARCHAR(64) PRIMARY KEY,
        provider VARCHAR(32) NOT NULL,
        provider_user_id VARCHAR(128) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
        requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS social_outbox_events (
        id VARCHAR(64) PRIMARY KEY,
        event_type VARCHAR(64) NOT NULL,
        aggregate_id VARCHAR(64) NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        processed BOOLEAN NOT NULL DEFAULT FALSE
      );

      CREATE INDEX IF NOT EXISTS idx_social_accounts_creator ON social_accounts(creator_id);
      CREATE INDEX IF NOT EXISTS idx_social_accounts_sync ON social_accounts(next_sync_at, status);
    `);
    tablesInitialized = true;
  } catch (err) {
    console.warn('[SocialRepo] Postgres init skipped or failed, using local store:', err);
  }
}

/**
 * Finds account by provider and provider_user_id
 */
export async function findSocialAccountByProviderId(
  provider: 'instagram',
  providerUserId: string
): Promise<SocialAccount | null> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(
      `SELECT * FROM social_accounts WHERE provider = $1 AND provider_user_id = $2`,
      [provider, providerUserId]
    );
    if (res.rows.length > 0) return res.rows[0];
  }

  for (const acc of inMemoryAccounts.values()) {
    if (acc.provider === provider && acc.provider_user_id === providerUserId) {
      return acc;
    }
  }
  return null;
}

/**
 * Lists all connected social accounts for a creator (never exposes credentials)
 */
export async function getSocialAccountsByCreatorId(creatorId: string): Promise<SocialAccount[]> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(
      `SELECT * FROM social_accounts WHERE creator_id = $1 AND status != 'REVOKED' ORDER BY connected_at DESC`,
      [creatorId]
    );
    return res.rows;
  }

  return Array.from(inMemoryAccounts.values()).filter(
    (acc) => acc.creator_id === creatorId && acc.status !== 'REVOKED'
  );
}

/**
 * Connects or updates a social account with encrypted credentials
 */
export async function saveSocialAccountAndCredentials(
  account: Omit<SocialAccount, 'id'> & { id?: string },
  credential: Omit<SocialCredential, 'account_id'>
): Promise<{ accountId: string; isNew: boolean }> {
  // Check for duplicate account across creators
  const existing = await findSocialAccountByProviderId(account.provider, account.provider_user_id);
  if (existing && existing.creator_id !== account.creator_id && existing.status === 'ACTIVE') {
    throw new Error(
      `Account @${account.username} is already linked to another creator profile. Please contact support if you own this account.`
    );
  }

  const accountId = existing ? existing.id : account.id || crypto.randomUUID();
  const fullAccount: SocialAccount = {
    ...account,
    id: accountId,
    status: account.status || 'ACTIVE',
    sync_tier: account.sync_tier || 'WARM',
    failure_count: account.failure_count ?? 0,
    scopes: account.scopes || [],
    capabilities: account.capabilities || {},
    connected_at: account.connected_at || new Date(),
    last_synced_at: account.last_synced_at || null,
    next_sync_at: account.next_sync_at || null,
  };

  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO social_accounts (
          id, creator_id, provider, provider_user_id, username, account_type,
          profile_picture_url, followers_count, media_count, status, scopes,
          capabilities, connected_at, last_synced_at, next_sync_at, sync_tier, failure_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (provider, provider_user_id) DO UPDATE SET
          username = EXCLUDED.username,
          account_type = EXCLUDED.account_type,
          profile_picture_url = EXCLUDED.profile_picture_url,
          followers_count = EXCLUDED.followers_count,
          media_count = EXCLUDED.media_count,
          status = 'ACTIVE',
          scopes = EXCLUDED.scopes,
          capabilities = EXCLUDED.capabilities,
          last_synced_at = EXCLUDED.last_synced_at,
          next_sync_at = EXCLUDED.next_sync_at,
          failure_count = 0`,
        [
          fullAccount.id,
          fullAccount.creator_id,
          fullAccount.provider,
          fullAccount.provider_user_id,
          fullAccount.username,
          fullAccount.account_type,
          fullAccount.profile_picture_url,
          fullAccount.followers_count,
          fullAccount.media_count,
          fullAccount.status,
          fullAccount.scopes,
          JSON.stringify(fullAccount.capabilities),
          fullAccount.connected_at,
          fullAccount.last_synced_at,
          fullAccount.next_sync_at,
          fullAccount.sync_tier,
          fullAccount.failure_count,
        ]
      );

      await client.query(
        `INSERT INTO social_credentials (
          account_id, token_ciphertext, token_nonce, key_id, token_type, expires_at, created_at, rotated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (account_id) DO UPDATE SET
          token_ciphertext = EXCLUDED.token_ciphertext,
          token_nonce = EXCLUDED.token_nonce,
          key_id = EXCLUDED.key_id,
          token_type = EXCLUDED.token_type,
          expires_at = EXCLUDED.expires_at,
          rotated_at = NOW()`,
        [
          accountId,
          credential.token_ciphertext,
          credential.token_nonce,
          credential.key_id,
          credential.token_type,
          credential.expires_at,
          credential.created_at,
          credential.rotated_at,
        ]
      );

      // Emit Outbox Event: SocialConnected
      await client.query(
        `INSERT INTO social_outbox_events (id, event_type, aggregate_id, payload, created_at, processed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          'SocialConnected',
          fullAccount.creator_id,
          JSON.stringify({
            creatorId: fullAccount.creator_id,
            provider: fullAccount.provider,
            providerUserId: fullAccount.provider_user_id,
            username: fullAccount.username,
            followersCount: fullAccount.followers_count,
          }),
          new Date(),
          false,
        ]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } else {
    // In-memory fallback
    inMemoryAccounts.set(accountId, fullAccount);
    inMemoryCredentials.set(accountId, {
      ...credential,
      account_id: accountId,
    });
    inMemoryOutbox.push({
      id: crypto.randomUUID(),
      event_type: 'SocialConnected',
      aggregate_id: fullAccount.creator_id,
      payload: {
        creatorId: fullAccount.creator_id,
        provider: fullAccount.provider,
        providerUserId: fullAccount.provider_user_id,
        username: fullAccount.username,
        followersCount: fullAccount.followers_count,
      },
      created_at: new Date(),
      processed: false,
    });
  }

  return { accountId, isNew: !existing };
}

/**
 * Disconnects an account: deletes credentials, marks REVOKED, emits SocialDisconnected
 */
export async function disconnectSocialAccount(creatorId: string, provider: 'instagram'): Promise<boolean> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const accRes = await client.query(
        `SELECT id FROM social_accounts WHERE creator_id = $1 AND provider = $2`,
        [creatorId, provider]
      );
      if (accRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      const accountId = accRes.rows[0].id;

      // Delete credentials
      await client.query(`DELETE FROM social_credentials WHERE account_id = $1`, [accountId]);

      // Mark account REVOKED
      await client.query(`UPDATE social_accounts SET status = 'REVOKED' WHERE id = $1`, [accountId]);

      // Outbox event
      await client.query(
        `INSERT INTO social_outbox_events (id, event_type, aggregate_id, payload, created_at, processed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          'SocialDisconnected',
          creatorId,
          JSON.stringify({ creatorId, provider, accountId }),
          new Date(),
          false,
        ]
      );

      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  for (const [id, acc] of inMemoryAccounts.entries()) {
    if (acc.creator_id === creatorId && acc.provider === provider) {
      inMemoryCredentials.delete(id);
      acc.status = 'REVOKED';
      inMemoryOutbox.push({
        id: crypto.randomUUID(),
        event_type: 'SocialDisconnected',
        aggregate_id: creatorId,
        payload: { creatorId, provider, accountId: id },
        created_at: new Date(),
        processed: false,
      });
      return true;
    }
  }
  return false;
}

/**
 * Deauthorizes user from Meta callback: removes token, marks REVOKED
 */
export async function deauthorizeMetaUser(metaUserId: string): Promise<boolean> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(
      `SELECT id, creator_id FROM social_accounts WHERE provider = 'instagram' AND provider_user_id = $1`,
      [metaUserId]
    );
    if (res.rows.length > 0) {
      const { id, creator_id } = res.rows[0];
      await pool.query(`DELETE FROM social_credentials WHERE account_id = $1`, [id]);
      await pool.query(`UPDATE social_accounts SET status = 'REVOKED' WHERE id = $1`, [id]);
      return true;
    }
  }

  for (const [id, acc] of inMemoryAccounts.entries()) {
    if (acc.provider === 'instagram' && acc.provider_user_id === metaUserId) {
      inMemoryCredentials.delete(id);
      acc.status = 'REVOKED';
      return true;
    }
  }
  return false;
}

/**
 * Creates data deletion request record
 */
export async function recordDataDeletionRequest(
  metaUserId: string,
  provider = 'instagram'
): Promise<DataDeletionRequest> {
  const confirmationCode = `del_${crypto.randomBytes(16).toString('hex')}`;
  const request: DataDeletionRequest = {
    confirmation_code: confirmationCode,
    provider,
    provider_user_id: metaUserId,
    status: 'COMPLETED',
    requested_at: new Date(),
    completed_at: new Date(),
  };

  // Perform immediate credential cleanup
  await deauthorizeMetaUser(metaUserId);

  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    await pool.query(
      `INSERT INTO social_data_deletion_requests (confirmation_code, provider, provider_user_id, status, requested_at, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        request.confirmation_code,
        request.provider,
        request.provider_user_id,
        request.status,
        request.requested_at,
        request.completed_at,
      ]
    );
  } else {
    inMemoryDeletions.set(confirmationCode, request);
  }

  return request;
}

/**
 * Checks data deletion request status
 */
export async function getDataDeletionStatus(confirmationCode: string): Promise<DataDeletionRequest | null> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(
      `SELECT * FROM social_data_deletion_requests WHERE confirmation_code = $1`,
      [confirmationCode]
    );
    if (res.rows.length > 0) return res.rows[0];
  }

  return inMemoryDeletions.get(confirmationCode) || null;
}

/**
 * Finds account by ID
 */
export async function getSocialAccountById(id: string): Promise<SocialAccount | null> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(`SELECT * FROM social_accounts WHERE id = $1`, [id]);
    if (res.rows.length > 0) return res.rows[0];
  }
  return inMemoryAccounts.get(id) || null;
}

/**
 * Finds credential by account ID (restricted access, never for client response)
 */
export async function getSocialCredentialByAccountId(accountId: string): Promise<SocialCredential | null> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(`SELECT * FROM social_credentials WHERE account_id = $1`, [accountId]);
    if (res.rows.length > 0) return res.rows[0];
  }
  return inMemoryCredentials.get(accountId) || null;
}

/**
 * Finds active accounts due for synchronization
 */
export async function getDueAccountsForSync(limit = 50): Promise<SocialAccount[]> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(
      `SELECT * FROM social_accounts
       WHERE status = 'ACTIVE' AND (next_sync_at IS NULL OR next_sync_at <= NOW())
       ORDER BY next_sync_at ASC NULLS FIRST
       LIMIT $1`,
      [limit]
    );
    return res.rows;
  }

  const now = new Date();
  const due: SocialAccount[] = [];
  for (const acc of inMemoryAccounts.values()) {
    if (acc.status === 'ACTIVE') {
      if (!acc.next_sync_at || acc.next_sync_at <= now) {
        due.push(acc);
        if (due.length >= limit) break;
      }
    }
  }
  return due;
}

/**
 * Updates synchronization metadata and status for a social account
 */
export async function updateSocialAccountSyncState(
  accountId: string,
  updates: Partial<SocialAccount>
): Promise<void> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(updates)) {
      if (key === 'id') continue;
      fields.push(`${key} = $${idx}`);
      values.push(key === 'capabilities' ? JSON.stringify(val) : val);
      idx++;
    }

    if (fields.length > 0) {
      values.push(accountId);
      await pool.query(
        `UPDATE social_accounts SET ${fields.join(', ')} WHERE id = $${idx}`,
        values
      );
    }
  }

  const existing = inMemoryAccounts.get(accountId);
  if (existing) {
    inMemoryAccounts.set(accountId, {
      ...existing,
      ...updates,
    });
  }
}

/**
 * Emits an event to the outbox table
 */
export async function emitSocialOutboxEvent(
  eventType: string,
  aggregateId: string,
  payload: Record<string, any>
): Promise<void> {
  const event: OutboxEvent = {
    id: crypto.randomUUID(),
    event_type: eventType,
    aggregate_id: aggregateId,
    payload,
    created_at: new Date(),
    processed: false,
  };

  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    await pool.query(
      `INSERT INTO social_outbox_events (id, event_type, aggregate_id, payload, created_at, processed)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [event.id, event.event_type, event.aggregate_id, JSON.stringify(event.payload), event.created_at, event.processed]
    );
    return;
  }

  inMemoryOutbox.push(event);
}

/**
 * Retrieves pending or all outbox events
 */
export async function getSocialOutboxEvents(limit = 50): Promise<OutboxEvent[]> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    const res = await pool.query(
      `SELECT * FROM social_outbox_events ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  }
  return inMemoryOutbox.slice(-limit);
}

/**
 * Records an immutable audit log entry for compliance tracking
 */
export async function logSocialAuditAction(
  creatorId: string,
  action: SocialAuditLog['action'],
  provider = 'instagram',
  metadata: Record<string, any> = {}
): Promise<void> {
  const log: SocialAuditLog = {
    id: crypto.randomUUID(),
    creator_id: creatorId,
    action,
    provider,
    metadata,
    created_at: new Date(),
  };

  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    try {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS social_audit_logs (
          id VARCHAR(64) PRIMARY KEY,
          creator_id VARCHAR(64) NOT NULL,
          action VARCHAR(64) NOT NULL,
          provider VARCHAR(32) NOT NULL,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        INSERT INTO social_audit_logs (id, creator_id, action, provider, metadata, created_at)
        VALUES ($1, $2, $3, $4, $5, $6);`,
        [log.id, log.creator_id, log.action, log.provider, JSON.stringify(log.metadata), log.created_at]
      );
      return;
    } catch (e) {
      console.warn('[SocialRepo] Failed to write audit log to Postgres:', e);
    }
  }

  inMemoryAuditLogs.push(log);
}

/**
 * Retrieves audit logs for a creator
 */
export async function getSocialAuditLogs(creatorId: string, limit = 50): Promise<SocialAuditLog[]> {
  const pool = getPool();
  if (pool) {
    await initSocialDbTables();
    try {
      const res = await pool.query(
        `SELECT * FROM social_audit_logs WHERE creator_id = $1 ORDER BY created_at DESC LIMIT $2`,
        [creatorId, limit]
      );
      return res.rows;
    } catch {
      return [];
    }
  }

  return inMemoryAuditLogs
    .filter((l) => l.creator_id === creatorId)
    .slice()
    .reverse()
    .slice(0, limit);
}


