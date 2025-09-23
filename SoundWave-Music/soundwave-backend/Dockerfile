# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/audio uploads/images

# Create logs directory
RUN mkdir -p logs

# Set permissions
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 5000



# Start the application
CMD ["npm", "run", "dev"]
