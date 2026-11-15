# discovery-service Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `discovery_db`

## Publishes
- discovery.events.v1

## Consumes
- creator.events.v1
- campaign.events.v1
- social-account.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
