# --- BUILD STAGE ---
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# --- RUNNER STAGE ---
FROM node:24-slim AS runner
WORKDIR /app

USER node

ENV NODE_ENV=production
ENV OTEL_SERVICE_NAME="node-poc-service"

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

CMD ["node", "--import", "./instrumentation.js", "server.js"]