# مرحلة القاعدة
FROM node:20 AS base

# تثبيت التبعيات اللازمة لـ Chromium
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# إعداد مجلد العمل
WORKDIR /app

# نسخ ملفات إعداد المشروع
COPY package.json package-lock.json* ./

# تثبيت التبعيات (بما في ذلك Puppeteer)
RUN npm ci

# نسخ باقي ملفات المشروع
COPY . .

# مرحلة البناء
FROM base AS builder
WORKDIR /app
RUN npm run build

# مرحلة الإنتاج
FROM node:20 AS runner
WORKDIR /app

# تثبيت التبعيات اللازمة لـ Chromium في مرحلة الإنتاج
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# إعداد المتغيرات البيئية
ENV NODE_ENV=production
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache

# إنشاء مجلد التخزين المؤقت وتعديل الأذونات
RUN mkdir -p /tmp/puppeteer_cache \
    && chown -R 1001:1001 /tmp/puppeteer_cache \
    && chmod -R 777 /tmp/puppeteer_cache

# تثبيت التبعيات اللازمة للإنتاج فقط
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# نسخ مخرجات البناء
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public


# Install puppeteer so it's available in the container.
RUN npm init -y &&  \
    npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules \
    && chown -R pptruser:pptruser /package.json \
    && chown -R pptruser:pptruser /package-lock.json

# إعداد المستخدم غير الجذر للأمان
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# تعيين المنفذ
EXPOSE 3000
ENV PORT=3000

# تشغيل التطبيق
CMD ["npm", "start"]