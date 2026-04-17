#!/bin/bash

# keycevente Startup Script
# This script helps you get started with keycevente quickly

set -e

echo "================================"
echo "keycevente - E-commerce MVP"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo ".env.local created successfully!"
fi

echo ""
echo "Starting keycevente with Docker Compose..."
echo ""

# Build and start containers
docker-compose up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 5

# Check if postgres is healthy
echo "Checking database health..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo "Database is ready!"
        break
    fi
    echo "Waiting for database... ($i/30)"
    sleep 1
done

# Check product count
echo ""
echo "Verifying database initialization..."
PRODUCT_COUNT=$(docker-compose exec -T postgres psql -U postgres -d keycevente -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null | xargs)
echo "Products in database: $PRODUCT_COUNT"

echo ""
echo "================================"
echo "keycevente is running!"
echo "================================"
echo ""
echo "Frontend:  http://localhost:3000"
echo "API:       http://localhost:3000/api"
echo ""
echo "Services:"
docker-compose ps
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop:          docker-compose down"
echo "  Reset data:    docker-compose down -v && docker-compose up -d"
echo "  Database CLI:  docker-compose exec postgres psql -U postgres -d keycevente"
echo ""
