# --- Builder stage ---
FROM node:18-bullseye AS builder
WORKDIR /app

# 依存だけ先に入れてキャッシュを効かせる
COPY package*.json ./
RUN npm ci

# 残りのソースをコピー
COPY . .

# Next.js をビルド
RUN next build

# --- Runner stage ---
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# standalone 出力を実行環境にコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["sh","-c","next start"]
