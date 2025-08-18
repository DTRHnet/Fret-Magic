#!/bin/bash
set -e

echo "🐳 Docker Deployment Setup"
echo "Project Type: nodejs"
echo ""

# Check if Docker is installed
if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker is not installed."
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
    echo "❌ Docker Compose is not installed."
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""
echo "🔨 Building Docker image..."
docker build -t replitake-app .

echo ""
echo "✅ Docker setup completed!"
echo ""
echo "Next steps:"
echo "1. Configure your .env.local file"
echo "2. Run './start.sh' to start with Docker Compose"
echo "   OR run 'docker run -p 3000:3000 replitake-app' for simple container"
echo ""
