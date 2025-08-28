# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 依存だけ先にインストール（この階層に package.json / lock がある前提）
COPY package.json package-lock.json ./
RUN npm ci

# 残りのソースをコピー
COPY . ./
RUN npm run build

# --- Runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# standalone 構成をコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
