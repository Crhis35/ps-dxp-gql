
.PHONY: build
# Build the containers
build:
	docker compose up --build
# Clean the container image
# docker system prune
clean:
	docker compose rm
# Run the container image
down:
	docker compose down

all: build

