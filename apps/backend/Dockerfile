FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/config/package.json packages/config/package.json

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN pnpm install --frozen-lockfile=false

COPY apps/backend apps/backend
COPY packages/shared packages/shared

EXPOSE 3001

CMD ["pnpm","-C","apps/backend","dev"]
