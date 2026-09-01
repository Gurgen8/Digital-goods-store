# Test Assignment (Monorepo)

## Repository structure

```text
project/
├── apps/
│   ├── frontend/
│   └── backend/
├── packages/
│   ├── shared/
│   └── config/
├── package.json
├── pnpm-workspace.yaml
├── README.md
├── .gitignore
├── .env.example
└── docker-compose.yml
```

## Tech

- pnpm workspaces
- TypeScript
- React + Vite
- Node.js (Express)
- Shared API types: `packages/shared`

## How to run (local)

1. Install dependencies

```bash
pnpm install
```

2. Start backend + frontend

```bash
pnpm dev
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
  - Health: http://localhost:3001/api/health
  - Products: http://localhost:3001/api/products

## Main frontend components

- Header + Catalog dropdown
- Hero carousel (autoplay + arrows + dots)
- Service icons strip
- Steam top-up block (currency switch UI)
- Product grid + product cards
- Purchase flow:
  - Buy → `POST /api/orders`
  - Checkout mock payment → `POST /api/orders/:id/pay`
  - Order status page → `GET /api/orders/:id`
- Admin recovery:
  - List: `GET /api/admin/recovery-orders`
  - Retry delivery: `POST /api/admin/orders/:id/retry-delivery`

## Responsive breakpoints (checked in CSS)

- 560px (grid: 2 cols)
- 768px (container padding)
- 900px (grid: 3 cols / layout stacks)
- 1220px (grid: 4 cols)
- 1280px (container padding)

## Figma assets used / limitations

The provided Figma link was viewable, but **Inspect / Dev mode was not доступен без авторизации** in this environment. Because of that:

- exact font family/weights, exact colors and spacing could not be extracted pixel-perfect;
- content images and some icons could not be exported directly from the file.

What is done instead:

- UI icons + service icons are implemented as inline SVG (close to the visible shapes);
- product/review images are generated via the allowed image endpoint:
  - `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?...`

If you provide an Inspect-enabled link (or exported Variables/Styles), it can be tightened to exact Figma tokens.

## Tests

```bash
pnpm -C apps/backend test
```

## Docker

```bash
docker compose up --build
```

