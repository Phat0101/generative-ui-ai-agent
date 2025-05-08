# Stage 1: Build the Next.js application
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package.json and lock file
# Assuming npm, adjust if using yarn or pnpm
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the Next.js application
# Environment variables needed for build time (like NEXT_PUBLIC_...) should be passed here if any
RUN npm run build --turbo

# Stage 2: Create the production image
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package.json and lock file from builder (needed for production install)
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy built assets from the builder stage AFTER installing prod dependencies
COPY --from=builder /app/.next ./.next/
COPY --from=builder /app/public ./public/
# If you have a standalone output configuration in next.config.js, this part would be different
# (copying from /app/.next/standalone and /app/.next/static)

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js application
# Environment variables for runtime (like MCP server URLs) will be passed via docker-compose
CMD ["npm", "run", "start"] 