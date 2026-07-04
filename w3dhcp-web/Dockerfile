FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY w3dhcp-web/package*.json ./
RUN npm ci

# Copy the rest of the application
COPY w3dhcp-web/ ./

# Expose port
EXPOSE 3000

# Start script
CMD ["npm", "start"]
