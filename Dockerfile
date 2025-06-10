# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Install `serve` to serve the app
RUN npm install -g serve

# Production image, copy all necessary files
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Install Puppeteer dependencies (for Chromium)
RUN apk add --no-cache \
    ca-certificates \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Create and set permissions for Puppeteer cache directory
RUN mkdir -p /tmp/puppeteer_cache && chmod -R 777 /tmp/puppeteer_cache

# Set Puppeteer cache directory
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache

# Optionally set Puppeteer to use the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy only the output of the build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npx", "next", "start"]