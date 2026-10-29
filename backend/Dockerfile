# ── Multi-Stage Production Dockerfile for Adrenaline Backend ──
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ── Runtime Stage ──
FROM node:22-alpine

WORKDIR /usr/src/app

# Security: Run as unprivileged node user
USER node

COPY --chown=node:node --from=builder /usr/src/app ./

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
