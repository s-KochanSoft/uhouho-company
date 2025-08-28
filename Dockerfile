# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 依存だけ先にインストール（内側 app1/app1 の package.json / lock をコピー）
COPY app1/app1/package.json app1/app1/package-lock.json ./
RUN npm ci

# 残りのソースをコピー（内側 app1/app1 ディレクトリ全体）
COPY app1/app1/ ./

# Next.js をビルド（standalone 出力を想定）
RUN npm run build

# --- Runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ビルド成果物をコピー（standalone 構成）
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
