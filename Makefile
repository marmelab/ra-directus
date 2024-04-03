.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init: ## initialize .env and data.db file, install dependencies and build
	@echo "Initializing .env file...";
	@cp ./packages/demo/.env.example ./packages/demo/.env
	@echo "Initializing data.db file...";
	@cp ./directus/database/data.db.template ./directus/database/data.db
	$(MAKE) install
	$(MAKE) build-ra-directus

install: package.json ## install dependencies
	@if [ "$(CI)" != "true" ]; then \
		echo "Full install..."; \
		yarn; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Frozen install..."; \
		yarn --frozen-lockfile; \
	fi

build-ra-directus:
	@echo "Transpiling ra-directus files...";
	@cd ./packages/ra-directus && yarn -s build

build-demo:
	@echo "Transpiling demo files...";
	@cd ./packages/demo && yarn -s build

build: build-ra-directus build-demo ## compile ES6 files to JS

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@yarn -s lint

prettier: ## prettify the source code using prettier
	@echo "Running prettier..."
	@yarn -s prettier

test: build test-unit lint ## launch all tests

test-unit: ## launch unit tests
	echo "Running unit tests...";
	yarn -s test-unit;

start-directus: ## start local Directus
	@echo "Starting Directus...";
	@cd ./directus && docker compose up -d

stop-directus: ## stop local Directus
	@echo "Stopping Directus...";
	@cd ./directus && docker compose down

run-demo: ## start the demo app
	@cd ./packages/demo && yarn start

run: start-directus run-demo ## start the demo app with local Directus