# --- Builder ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# 依存インストール
COPY package.json package-lock.json ./
RUN npm ci

# ソースをコピーして本番ビルド
COPY . ./
RUN npm run build

# --- Runner ---
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# ★ Render が注入する $PORT をそのまま使う。ここで PORT を固定しない

# 本番依存だけインストール
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 実行に必要な成果物をコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000
CMD ["node", "server.js"]
