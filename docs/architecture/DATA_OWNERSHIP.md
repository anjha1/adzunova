# Data Ownership

Each service owns its database, schema, migrations, credentials and retention policy.
Cross-service joins against another service's database are prohibited. Build read
models through APIs/events. Payment ledger storage and access are isolated.

Local Compose uses one PostgreSQL server with separate databases/roles for ease of
setup. This is logical development isolation, not a production security boundary.
Production should use separately managed credentials and separate instances where
required by the security and availability model.
