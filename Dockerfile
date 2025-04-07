# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript code
RUN npm run build

# Stage 2: Create the final production image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install ALL dependencies (including dev for prisma CLI)
COPY package*.json ./
RUN npm ci

# Copy the built application code from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the generated Prisma client AND the prisma schema/migrations folder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Prune development dependencies after copying necessary artifacts
RUN npm prune --omit=dev

# Expose the application port
EXPOSE 5000

# Command to run migrations and then the application
# Use sh -c to run multiple commands
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
