# ============================================================
# Dockerfile for Node.js Express Backend
# ============================================================

FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source code
COPY . .

# Ensure data directory exists for embedded database storage (SQLite / LowDB)
RUN mkdir -p /app/data

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Start Express server (auto-seeds demo users and tickets on initial empty DB)
CMD ["node", "server.js"]
