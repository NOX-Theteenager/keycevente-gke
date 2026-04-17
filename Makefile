.PHONY: help start stop restart logs build clean seed db-shell

help:
	@echo "keycevente - E-commerce MVP"
	@echo ""
	@echo "Available commands:"
	@echo "  make start       - Start all services with Docker Compose"
	@echo "  make stop        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make build       - Build Docker image"
	@echo "  make clean       - Stop and remove containers"
	@echo "  make seed        - Seed database with initial data"
	@echo "  make db-shell    - Open PostgreSQL shell"
	@echo "  make dev         - Start development server locally"
	@echo "  make dev-install - Install dependencies for local development"

start:
	@echo "Starting keycevente services..."
	docker-compose up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "API: http://localhost:3000/api"

stop:
	@echo "Stopping keycevente services..."
	docker-compose down

restart:
	@echo "Restarting keycevente services..."
	docker-compose restart

logs:
	docker-compose logs -f

build:
	@echo "Building Docker image..."
	docker-compose build --no-cache

clean:
	@echo "Removing containers and volumes..."
	docker-compose down -v
	@echo "Containers and volumes removed!"

seed:
	@echo "Seeding database..."
	docker-compose exec postgres psql -U postgres -d keycevente < scripts/init-db.sql
	@echo "Database seeded!"

db-shell:
	docker-compose exec postgres psql -U postgres -d keycevente

dev:
	@echo "Starting development server..."
	pnpm dev

dev-install:
	@echo "Installing dependencies..."
	pnpm install
	@echo "Dependencies installed!"
	@echo "Run 'make dev' to start the development server"

.DEFAULT_GOAL := help
