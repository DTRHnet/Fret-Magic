# Use official Node.js runtime as base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies for Node.js build tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./



# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application if needed
RUN vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 3000

# Start application
CMD ["NODE_ENV=production node dist/index.js"]