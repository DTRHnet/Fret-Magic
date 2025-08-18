#!/bin/bash
set -e

echo "🚀 Starting nodejs application..."

# Load environment variables
if [[ -f ".env.local" ]]; then
    export $(cat .env.local | xargs)
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
