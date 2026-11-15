# identity-service Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `identity_db`

## Publishes
- identity.events.v1

## Consumes
- user.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
