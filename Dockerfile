# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 依存インストール（package.json と lock を先に）
COPY package.json package-lock.json ./
RUN npm ci

# 残りのソースをコピー
COPY . ./

# Next.js 本番ビルド（lint で止めたくない場合は next.config で ignoreDuringBuilds を設定）
RUN npm run build

# --- Runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# standalone 構成をコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
