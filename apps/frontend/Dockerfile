FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/config/package.json packages/config/package.json

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN pnpm install --frozen-lockfile=false

COPY apps/frontend apps/frontend
COPY packages/shared packages/shared

EXPOSE 5173

CMD ["pnpm","-C","apps/frontend","dev","--host","0.0.0.0","--port","5173"]
