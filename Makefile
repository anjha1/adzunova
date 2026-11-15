.PHONY: infra-up infra-up-full infra-down infra-logs

infra-up:
	docker compose -f infra/local/docker-compose.yml up -d postgres ledger-postgres redis

infra-up-full:
	docker compose -f infra/local/docker-compose.yml --profile full up -d

infra-down:
	docker compose -f infra/local/docker-compose.yml --profile full down

infra-logs:
	docker compose -f infra/local/docker-compose.yml logs -f
