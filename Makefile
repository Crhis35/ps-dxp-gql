
.PHONY: build
# Build the containers
build:
	docker compose up --build -d
# Clean the container image
clean:
	docker system prune
# Run the container image
down:
	docker compose down

all: build

