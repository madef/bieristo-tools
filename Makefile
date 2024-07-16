.DEFAULT_GOAL := help
.PHONY: help

args = `arg="$(filter-out $(firstword $(MAKECMDGOALS)),$(MAKECMDGOALS))" && echo $${arg:-${1}}`

help:
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

docker-build: ## docker build
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml build

docker-start: ## docker up
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml up -d

docker-stop: ## docker down
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml down

docker-restart: ## docker restart
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml down
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml up -d

docker-rebuild: ## rebuild docker
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml up -d --force-recreate --build

docker-bash: ## Connect to apache server
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml exec -w /usr/local/apache2/htdocs bieristo_tools bash

tailwind-watch: ## Tailwind watch
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml exec -w /usr/local/apache2/htdocs/tailwind bieristo_tools npx tailwindcss -i ../static/css/main.css -o ../static/css/style.min.css --minify --watch

tailwind-build: ## Tailwind build
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml exec -w /usr/local/apache2/htdocs/tailwind bieristo_tools npx tailwindcss -i ../static/css/main.css -o ../static/css/style.min.css --minify

js-standard: ## Check JS standard
	docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.override.yml exec -w /usr/local/apache2/htdocs/static/js bieristo_tools standard
