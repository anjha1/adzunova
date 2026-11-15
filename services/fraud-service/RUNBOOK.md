# fraud-service Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `fraud_db`

## Publishes
- fraud.events.v1

## Consumes
- identity.events.v1
- booking.events.v1
- payment.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
