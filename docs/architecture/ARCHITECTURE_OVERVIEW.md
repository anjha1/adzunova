# Architecture Overview

Adzunova uses **Domain-Driven Microservices + Monorepo + Event-Driven Architecture**.

- Monorepo is the source/workspace strategy, not runtime coupling.
- Each service owns a bounded context and its persistence model.
- Services are independently buildable and deployable.
- Synchronous HTTP handles request/response; Kafka events handle asynchronous domain integration.
- No service reads or writes another service's database.
- Payment ledger has separately managed persistence and credentials.
- OpenAPI and AsyncAPI contracts are versioned.
- Outbox/inbox, idempotency, retries and dead-letter handling are required patterns.

Generated code is a starting scaffold, not a production-ready implementation.
