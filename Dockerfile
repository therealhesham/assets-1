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
    libxkbcommon0 \  # إضافة مكتبة libxkbcommon0
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
    libxkbcommon0 \  # إضافة مكتبة libxkbcommon0
--no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# إعداد المتغيرات البيئية
ENV NODE_ENV=production
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# إنشاء مجلد التخزين المؤقت وتعديل الأذونات
RUN mkdir -p /tmp/puppeteer_cache \
    && chown -R node:node /tmp/puppeteer_cache \
    && chmod -R 777 /tmp/puppeteer_cache

# نسخ ملفات إعداد المشروع
COPY package.json package-lock.json* ./

# تثبيت التبعيات اللازمة للإنتاج فقط
RUN npm ci --only=production && npm cache clean --force

# نسخ مخرجات البناء
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# تثبيت Puppeteer وإعداد المستخدم
RUN npm install puppeteer && npm cache clean --force \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# إعداد المستخدم غير الجذر للأمان
USER pptruser

# تعيين المنفذ
EXPOSE 3000
ENV PORT=3000

# تشغيل التطبيق
CMD ["npm", "start"]