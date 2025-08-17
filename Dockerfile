FROM node:23-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV INSIDE_DOCKER=true
RUN apk add --no-cache postgresql-client
COPY package.json pnpm-lock.yaml* ./

# Установка необходимых пакетов
RUN corepack enable pnpm && pnpm i --prod
# Глобально устанавливаем drizzle-kit, tsx и typescript, чтобы они были доступны в PATH
RUN npm install -g drizzle-kit tsx typescript

ENV NEXT_TELEMETRY_DISABLED=1

# Копируем исходные файлы TypeScript и конфигурации
COPY src ./src
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY drizzle ./drizzle

# Копируем entrypoint скрипт
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Устанавливаем правильные права на файлы и на директорию src
RUN chown -R nextjs:nodejs /app
# Разрешаем доступ к директории src для пользователя nextjs
RUN chmod -R 755 /app/src

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]

CMD ["node", "server.js"]
