# Event-Driven Architecture

Every event carries event_id, event_type, event_version, aggregate_id, cell_id,
occurred_at and payload. Include correlation_id and causation_id where available.

- Use a transactional outbox for database-backed domain events.
- Consumers use an inbox/deduplication record keyed by consumer and event_id.
- Consumers must be idempotent.
- Configure bounded retries and dead-letter topics.
- Do not assume exactly-once end-to-end delivery.
- Validate events against versioned JSON schemas.
- Propagate trace and correlation context.
- Each topic has an owning service; consumers use documented contracts.
