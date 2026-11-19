# Adzunova Instagram Architecture & Internet-Scale Design

This document details the architectural design and capacity modeling for Adzunova's Instagram & Social Data Pipeline, spanning from local development (L0) to internet scale (L3: 100M+ connected creators).

---

## 1. Scale Ladder & Capacity Math

### Scale Ladder

| Level | Connected Accounts | Infrastructure Components | Bottlenecks Mitigated |
| :--- | :--- | :--- | :--- |
| **L0: Dev / Demo** | < 100 | PostgreSQL (single node), In-process Queue, In-memory Redis | Setup overhead, rapid feedback loop |
| **L1: Launch** | Up to 100,000 | PostgreSQL + Read Replica, Redis Cluster, BullMQ / SQS Queue, Worker Pool | Connection limits, burst traffic |
| **L2: Growth** | 1,000,000 – 10,000,000 | Apache Kafka / Redpanda, Partitioned Sync Workers, ClickHouse for Time-Series, OpenSearch Discovery, Edge CDN | Write throughput on relational DB, analytical query latency |
| **L3: Internet-Scale** | 100,000,000+ | Multi-region cells, Sharded PostgreSQL by `creator_id`, ClickHouse Cluster with TTL tiering, Regional Token Vaults | Global latency, data residency, Graph API throttling limits |

### Capacity Math (at L3: 100M Accounts)

- **Graph API Calls**:
  - Average calls per account: ~6 calls/day (HOT: 4 profile/views calls + WARM: 1 daily sync + weekly demographics amortized).
  - Daily request volume: $100{,}000{,}000 \times 6 = 600{,}000{,}000\text{ calls/day}$.
  - Average call rate: $\frac{600{,}000{,}000}{86{,}400\text{ s}} \approx 6{,}944\text{ req/s}$ (~7K req/s steady-state).
  - Peak call rate (5x – 10x headroom for thundering herd / re-sync bursts): **35,000 – 70,000 req/s**.
- **Time-Series Metric Storage**:
  - Daily metric records: ~10 metric rows per account per day (views, follower delta, impressions, reaches, engagement points).
  - Daily volume: $100{,}000{,}000 \times 10 = 1{,}000{,}000{,}000\text{ rows/day}$ (1B rows/day).
  - Annual volume: **~365 Billion rows/year**.
  - PostgreSQL is unviable for analytical scans at this volume; **ClickHouse** with `ReplacingMergeTree` and partition pruning by `(account_id, metric, toYYYYMM(ts))` is required at L2+.

---

## 2. Sync Scheduler Architecture

### Core Design Rules
1. **Zero Meta Graph calls on page views**: Every user and brand view reads strictly from local cache (Redis) or read replicas.
2. **Sharded Delayed Queue**: Work is partitioned by `shard = hash(account_id) % N` to preserve single-flight execution per account and prevent concurrent Graph API token conflicts.
3. **Idempotent Sync Jobs**: Deduplication key = `account_id + metric_group + window` (e.g., `ig_acc_123:views:2026-11-19T14`). Duplicate jobs within the same sync window are dropped.
4. **Schedule Jittering**: All cron triggers and scheduled `next_sync_at` timestamps apply $\pm 10\%\text{ to }20\%$ random jitter to prevent synchronized spikes across accounts connected at the top of the hour.

### Sync Tiers & Automatic Transitions

| Tier | Target Accounts | Frequency | Metrics Collected |
| :--- | :--- | :--- | :--- |
| **HOT** | Active campaigns open, or creator logged in within 48h | Every 4 to 6 hours | Profile counts, 24h Views total_value |
| **WARM** | Regular verified creators without active campaigns | Every 24 hours | Profile counts, Daily Views, Media counts |
| **COLD** | Inactive creators (>30 days since last login) | Every 7 days | Profile counts |
| **DEMOGRAPHICS** | All active/warm accounts | Weekly (every 7 days) | Gender, Age 7-bucket breakdown, Country |

#### Tier Transition Rules:
- New connection $\to$ **HOT** for first 72 hours.
- Deal offer received or campaign contract signed $\to$ Promoted to **HOT**.
- Inactivity $> 7$ days without active deal $\to$ Demoted to **WARM**.
- Inactivity $> 30$ days $\to$ Demoted to **COLD**.
- 3 consecutive sync failures $\to$ Demoted to **COLD** with notification to creator.

### Meta Rate-Limit Awareness & Adaptive Throttling
- **Header Parsing**: Every Graph API response inspects:
  - `x-app-usage`: `{"call_count": int, "total_cputime": int, "total_time": int}` (% of rate limit used by app).
  - `x-business-use-case-usage`: per-account bucket consumption.
- **Dynamic Throttle Thresholds**:
  - $\ge 80\%$ usage: Worker pool throttles dispatch rate by 50%, deprioritizing COLD accounts.
  - $\ge 90\%$ usage: Pauses COLD and WARM tiers, processing only HOT accounts.
  - $\ge 95\%$ usage: Circuit breaker trips into `OPEN` state, pausing all outbound calls for backoff duration.
- **Throttling Error Codes (4, 17, 32, 613)**:
  - Backs off with exponential delay ($2^n \times \text{base} + \text{jitter}$).
  - Pushes `next_sync_at` back by 2 hours minimum.
  - Never retries immediately.
- **Token Invalidation (Error 190)**:
  - Flags account as `RECONNECT_REQUIRED`.
  - Emits `SocialTokenInvalid` outbox event to notify creator.
  - Immediately ceases scheduled syncs to avoid wasting Meta rate quota.

---

## 3. Storage Design & Schemas

### PostgreSQL (OLTP)
- Shard key: `creator_id`.
- Tenant-scoped row isolation.

```sql
-- social_accounts: core account metadata
CREATE TABLE social_accounts (
  id VARCHAR(64) PRIMARY KEY,
  creator_id VARCHAR(64) NOT NULL,
  provider VARCHAR(32) NOT NULL DEFAULT 'instagram',
  provider_user_id VARCHAR(128) NOT NULL,
  username VARCHAR(128) NOT NULL,
  account_type VARCHAR(32) NOT NULL,
  profile_picture_url TEXT,
  followers_count BIGINT NOT NULL DEFAULT 0,
  media_count INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RECONNECT_REQUIRED, REVOKED, SUSPENDED
  scopes TEXT[] DEFAULT '{}',
  capabilities JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_tier VARCHAR(16) NOT NULL DEFAULT 'WARM',
  failure_count INT NOT NULL DEFAULT 0,
  CONSTRAINT uq_social_provider_account UNIQUE(provider, provider_user_id)
);

-- social_credentials: token storage (AES-256-GCM envelope encrypted, separated)
CREATE TABLE social_credentials (
  account_id VARCHAR(64) PRIMARY KEY REFERENCES social_accounts(id) ON DELETE CASCADE,
  token_ciphertext TEXT NOT NULL,
  token_nonce VARCHAR(64) NOT NULL,
  key_id VARCHAR(32) NOT NULL DEFAULT 'v1',
  token_type VARCHAR(32) NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rotated_at TIMESTAMPTZ
);
```

### ClickHouse (Time-Series & Analytics)

```sql
CREATE TABLE social_metric_points (
  account_id LowCardinality(String),
  provider LowCardinality(String),
  metric LowCardinality(String),
  timestamp DateTime,
  value Float64,
  dims Map(String, String)
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (provider, account_id, metric, timestamp)
TTL timestamp + INTERVAL 13 MONTH;
```

### Demographics Snapshots & Derived Metrics
Demographics snapshots preserve token-scrubbed raw payloads while pre-computing derived audience metrics:
- `share_18_plus`: Sum of age buckets $18\text{--}24, 25\text{--}34, 35\text{--}44, 45\text{--}54, 55\text{--}64, 65+$.
- `share_13_17`: Share of minor audience (13–17 bucket).
- `share_18_34`: Dominant young adult demographic.
- `dominant_age_bucket`: Plurality age segment.
- `gender_known_share`: Ratio of $(F + M) / (F + M + U)$. (Meta often reports $U > 80\%$; never force-allocate $U$).
- `top_country`: Highest representation country code from geo breakdown (fallback to 'UNKNOWN' if restricted).

---

## 4. Event-Driven Outbox & Architecture

Partition Key: `creator_id` (guarantees strict ordering per creator).

### Core Events
1. `SocialConnected`: Creator links Instagram account. Triggers initial backfill sync and marks creator `SOCIAL_VERIFIED`.
2. `SocialDisconnected`: Creator disconnects. Purges credentials and revokes sync.
3. `SocialTokenInvalid`: Meta reports expired or revoked OAuth permissions (Code 190). Halts sync queue and notifies creator.
4. `MetricsUpdated`: Profile counts and views updated. Invalidates public cache and updates OpenSearch index.
5. `AudienceSnapshotUpdated`: New demographics snapshot recorded. Updates brand discovery filters.
6. `SyncFailed`: Terminal failure after bounded retries. Sent to DLQ for replay.
7. `CapabilityChanged`: Meta permission or metric capability added or removed.
8. `CreatorVerified`: Advance verification ladder stage upon verified data ingest.

---

## 5. Multi-Region Cell Architecture & Failure Isolation

1. **Regional Token Vaults**: Tokens are stored and encrypted exclusively in the creator's home cell (e.g., `cell-in-south`, `cell-eu-west`, `cell-us-east`). Decrypted tokens **never** cross cell boundaries.
2. **Global Read Replication**: Analytical read models (follower count, engagement rate, demographics summary) replicate globally to edge caches and discovery clusters.
3. **Graceful Degraded Modes**:
   - **Meta API Outage**: System continues serving the latest valid snapshot with a visible "Last updated: X hours ago" badge and a circuit breaker pause on background syncs.
   - **Redis Down**: Transparent fallback to relational DB queries with stricter concurrency limits.
   - **ClickHouse Down**: Outbox events buffer on the durable message bus until ClickHouse recovers.
   - **OpenSearch Down**: Fallback to category-based and verified creator listing queries on PostgreSQL replicas.
