# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run formatter    # Prettier format src/
npm start            # Storybook dev server (localhost:6006)
npm run build-storybook  # Build Storybook static site
npm run dev:worker   # Cloudflare Workers local dev (Wrangler)
npm run deploy       # Deploy to production (Cloudflare Workers)
npm run preview      # Deploy to preview environment
```

No test runner is configured via `npm test`; Vitest runs through the Storybook addon.

## Architecture

**Tech stack:** React 19 + TypeScript, Vite, MUI v7, React Router DOM v7, deployed to Cloudflare Workers via Wrangler. Hono handles edge routing in `src/server.tsx`.

**Feature-based structure:** Code is organized by domain feature under `src/`:

- `src/home/` — Home/landing page
- `src/blog/` — Blog listing and components
- `src/maze-creator/` — Maze generator with WebAssembly (Rust)
- `src/presentation/` — Shared UI primitives and components

Each feature follows a **container/presentation pattern**:
- `container/` — smart components with logic (`useGenerateProps`, state)
- `presentation/` — dumb components that only render props

**Routing** is defined in `src/App.tsx` using React Router DOM. The Cloudflare Worker entry (`src/server.tsx`) uses Hono to route requests to the React SPA.

**WebAssembly:** The maze-creator feature uses Rust compiled to WASM (`src/maze-creator/wasm/`). Algorithms (Kruskal, etc.) are in `wasm/src/algo/`, bindings in `wasm/pkg/`. The `vite-plugin-wasm` plugin handles bundling.

**Storybook:** Stories live alongside components as `*.stories.tsx`. The Storybook vitest addon is used for component-level testing.
