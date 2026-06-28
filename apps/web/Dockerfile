# syntax=docker/dockerfile:1
# Next.js (standalone) for the couple-calendar web app.
# Build context MUST be the repo ROOT (pnpm workspace), not apps/web:
#   docker build -f apps/web/Dockerfile -t couple-calendar-web .
# or with Cloud Build / Cloud Run:
#   gcloud run deploy couple-calendar-web --source . ... (uses this Dockerfile at repo root build)
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# ---- install deps + build (from repo root) ----
FROM base AS builder
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
# NEXT_PUBLIC_* are inlined at build time (NOT readable from Cloud Run runtime env),
# so they must be supplied as build args. Server-only vars (API_BASE_URL,
# SESSION_SECRET) are injected at runtime by Cloud Run instead.
ARG NEXT_PUBLIC_API_MOCKING=disabled
ARG NEXT_PUBLIC_APPLE_CLIENT_ID=""
ARG NEXT_PUBLIC_APPLE_REDIRECT_URI=""
ENV NEXT_PUBLIC_API_MOCKING=$NEXT_PUBLIC_API_MOCKING \
    NEXT_PUBLIC_APPLE_CLIENT_ID=$NEXT_PUBLIC_APPLE_CLIENT_ID \
    NEXT_PUBLIC_APPLE_REDIRECT_URI=$NEXT_PUBLIC_APPLE_REDIRECT_URI
RUN pnpm --filter @couple-calendar/web-next build

# ---- minimal runtime image (standalone output) ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Cloud Run injects PORT; default 3000 for local docker runs.
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
# standalone bundle is traced from the repo root, so it lands under apps/web/
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
