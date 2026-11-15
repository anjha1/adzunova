# organization-service Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `organization_db`

## Publishes
- organization.events.v1

## Consumes
- identity.events.v1
- user.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
