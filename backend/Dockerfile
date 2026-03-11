# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || (echo "Install failed in container; ensure lockfile exists" && exit 1)
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate || true
RUN npm run build || true

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/server.js"]