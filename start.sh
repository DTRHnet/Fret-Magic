#!/bin/bash
set -e

echo "🚀 Starting nodejs application..."

# Check if we're in Docker mode
if [[ -f "docker-compose.yml" ]] && [[ -f "Dockerfile" ]]; then
    echo "🐳 Detected Docker configuration - using Docker Compose..."
    
    # Load environment variables for Docker Compose
    if [[ -f ".env.local" ]]; then
        echo "Loading environment variables from .env.local..."
        export $(grep -v '^#' .env.local | xargs)
    fi
    
    # Start with Docker Compose
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose up -d
    elif docker compose version >/dev/null 2>&1; then
        docker compose up -d
    else
        echo "❌ Docker Compose not found"
        exit 1
    fi
    
    echo "✅ Application started with Docker Compose"
    echo "🔗 Visit: http://localhost:3000"
    echo ""
    echo "To view logs: docker-compose logs -f app"
    echo "To stop: docker-compose down"
    
else
    # Traditional deployment
    # Load environment variables safely
    if [[ -f ".env.local" ]]; then
        echo "Loading environment variables from .env.local..."
        set -a  # Automatically export all variables
        source .env.local
        set +a  # Turn off automatic export
        echo "✅ Environment variables loaded"
    else
        echo "⚠️  .env.local file not found. Some features may not work."
    fi

    # Run any build steps if needed
    
    echo "🔨 Building application..."
    vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
    

    # Start the application
    echo "Starting application with: NODE_ENV=production node dist/index.js"
    NODE_ENV=production node dist/index.js
fi
