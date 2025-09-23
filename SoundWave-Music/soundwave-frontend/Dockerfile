# Multi-stage build for React + Vite
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - Serve with Node.js
FROM node:18-alpine

# Install serve to serve static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check


# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
