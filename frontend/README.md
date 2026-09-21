# ChefMate — Frontend

React + TypeScript single-page app, built with Vite and styled with Tailwind CSS. Talks to the [backend](../backend) API for everything — AI recipe/image generation, and saving/loading the cookbook.

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8)
- The [backend](../backend) running somewhere reachable (defaults to `http://localhost:3000`)

## Setup

```bash
npm install
cp .env.example .env   # optional, see below
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Base URL of the backend API. Defaults to `http://localhost:3000` if unset. |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload. |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/`. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Serve the production build locally. |

## Project structure

```
src/
├── components/    # Presentational + feature components (Search, Recipe, Cookbook, RecipeCard, ...)
├── pages/         # Route-level pages (RecipePage)
├── lib/api.ts     # Typed API client — the only place that knows the backend's wire format
├── types.ts       # Shared TypeScript types + default preference values
└── constants.ts   # Shared constants (e.g. the recipe markdown className)
```

Routing (`main.tsx`) has two routes: `/` (the main app) and `/recipes/:id` (a saved recipe's detail page).
