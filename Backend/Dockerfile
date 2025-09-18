# Step 1: Use a lightweight Node.js image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files first (better caching)
COPY package*.json ./

# Step 4: Install only production dependencies
RUN npm install --production

# Step 5: Install curl for healthcheck
RUN apk add --no-cache curl

# Step 6: Copy the rest of the app
COPY . .

# Step 7: Expose port
EXPOSE 8001

# Step 8: Healthcheck (wait 5s before first check)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

# Step 9: Start the app
CMD ["node", "server.js"]
