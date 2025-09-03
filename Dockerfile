# --- Builder stage ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# 依存インストール
COPY package.json package-lock.json ./
RUN npm ci

# ソースをコピーして本番ビルド
COPY . ./
RUN npm run build

# --- Runner stage ---
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# ★ ここで PORT は設定しない（Render が注入する PORT を使う）

# standalone 出力を配置
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
