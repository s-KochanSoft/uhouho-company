# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 依存だけ先にインストール
COPY package*.json ./
RUN npm ci

# 残りのソースをコピー
COPY . .

# Next.js をビルド（npm script 経由）
RUN npm run build

# --- Runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ビルド成果物をコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# npm script 経由で起動
CMD ["node", "server.js"]
