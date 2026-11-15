# offer-service Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `offer_db`

## Publishes
- offer.events.v1

## Consumes
- campaign.events.v1
- creator.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
