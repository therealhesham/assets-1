# Install dependencies only when needed
FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-slim AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Install `serve` to serve the app (optional, as you're using `next start`)
RUN npm install -g serve

# Production image, copy all necessary files
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install dependencies for Puppeteer/Chrome and Arabic language support
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    fonts-noto-core \
    fonts-noto-extra \
    fonts-arabeyes \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libxss1 \
    libxtst6 \
    libgbm-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libxkbcommon0 \
    libglib2.0-0 \
    libgcc1 \
    wget \
    gnupg \
    locales \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Generate Arabic locale
RUN echo "ar_SA.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen ar_SA.UTF-8 && \
    update-locale LANG=ar_SA.UTF-8

# Set environment variables for Arabic locale
ENV LANG=ar_SA.UTF-8
ENV LANGUAGE=ar_SA:ar
ENV LC_ALL=ar_SA.UTF-8

# Create a non-root user
RUN addgroup --gid 1001 appgroup && adduser --uid 1001 --gid 1001 --disabled-password --gecos "" appuser

# Create and set permissions for Puppeteer cache directory
RUN mkdir -p /tmp/puppeteer_cache && chmod -R 777 /tmp/puppeteer_cache

# Set Puppeteer environment variables
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Install Chrome manually
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    google-chrome --version && \
    find / -name google-chrome 2>/dev/null || echo "Chrome not found"

# Copy only the output of the build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set ownership for app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npx", "next", "start"]