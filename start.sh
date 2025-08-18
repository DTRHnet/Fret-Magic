#!/bin/bash
set -e

echo "🚀 Starting nodejs application..."

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
