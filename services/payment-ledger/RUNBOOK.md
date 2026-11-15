# payment-ledger Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `ledger_db`

## Publishes
- payment.events.v1

## Consumes
- booking.events.v1
- contract.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
