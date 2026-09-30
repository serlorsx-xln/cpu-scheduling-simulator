# syntax=docker/dockerfile:1
# CPU Scheduling Simulator — Next.js 16 standalone image สำหรับ Coolify
# build: docker build -t cpu-scheduling-simulator .
# run:   docker run -p 3000:3000 cpu-scheduling-simulator

ARG NODE_VERSION=24-alpine

# ── 1) ติดตั้ง dependencies (cache แยกจากโค้ด) ─────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── 2) test + build ────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ตรรกะอัลกอริทึมต้องผ่าน unit test ก่อน build — ถ้าไม่ผ่าน deploy ล้มตรงนี้
RUN npm run test
RUN npm run build

# ── 3) runtime: เฉพาะ standalone server + static assets ────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

CMD ["node", "server.js"]
