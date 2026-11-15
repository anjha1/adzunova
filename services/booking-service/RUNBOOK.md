# booking-service Runbook

## Health
- GET /health/live
- GET /health/ready

## Database
- Owner database: `booking_db`

## Publishes
- booking.events.v1

## Consumes
- offer.events.v1
- campaign.events.v1

## Recovery
Document restart, replay, reconciliation and restore procedures here.
