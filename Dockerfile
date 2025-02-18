FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /unittesting-aiagent

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /unittesting-aiagent
COPY --from=deps /unittesting-aiagent/node_modules ./node_modules
COPY . .
# # This will do the trick, use the corresponding env file for each environment.
# COPY .env .env

RUN apk add --no-cache --virtual .build-deps \
  openssl

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production


RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /unittesting-aiagent

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /unittesting-aiagent/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /unittesting-aiagent/.next/static ./static
COPY --from=builder /unittesting-aiagent/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" npm run start
