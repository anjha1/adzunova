# ADR 016: ClickHouse Time-Series & Retention Architecture

## Status
Accepted

## Context
At L2/L3 scale (1M to 100M+ accounts), daily metric ingestion reaches 1 Billion rows/day (~365 Billion rows/year). Relational databases like PostgreSQL cannot support analytical aggregations and range scans at this scale.

## Decision
1. **L0/L1 Phase**: Single PostgreSQL / in-memory table `social_metric_points` for development and early launch.
2. **L2/L3 Architecture**: Ingest metric events into **ClickHouse** using `ReplacingMergeTree` with partitioning by `toYYYYMM(timestamp)` and primary key `(account_id, metric, timestamp)`.
3. **TTL Tiering**:
   - 0–13 months: Raw daily resolution.
   - 14–36 months: Automated daily rollups.
   - >36 months: Monthly aggregate rollups.

## Consequences
- Enables sub-100ms multi-month time series queries for creator analytics dashboards.
- Prevents database bloat on the OLTP cluster.
