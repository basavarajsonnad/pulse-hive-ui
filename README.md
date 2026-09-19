# Pulse Hive UI

Next.js (App Router) + Ant Design + Redux Toolkit + SCSS.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI library | Ant Design 6 |
| State | Redux Toolkit + React-Redux |
| Styling | SCSS (CSS Modules) |
| Package manager | pnpm |
| Node | 22 (see `.nvmrc`) |

## Prerequisites

- **Node 22** — run `nvm use` (reads `.nvmrc`) or `nvm install 22`.
- **pnpm** — `corepack enable pnpm`.

## Getting started

```bash
nvm use            # Node 22
pnpm install
pnpm dev           # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Project layout

```
app/                  App Router routes
  layout.tsx          Root layout: StoreProvider → AntdRegistry → ConfigProvider
  globals.scss        Global styles
  (portal)/           Route group: sidebar shell around all portal pages
    customers/tenant-setup/tenants/   Tenants page (/customers/tenant-setup/tenants)
components/
  layout/             Sidebar, TabNav, top bar, filter bar
  tenants/            Tenants table, inline-edit cell, add/edit drawer, helpers
mock/                 Mock data (tenants.ts) — swap for API calls later
types/                Shared TypeScript types
store/
  index.ts            makeStore() factory + RootState / AppDispatch types
  hooks.ts            Typed useAppSelector / useAppDispatch
  StoreProvider.tsx   Client provider (per-instance store)
  slices/             Redux slices (tenantsSlice)
theme/
  themeConfig.ts      Ant Design design tokens (ConfigProvider)
styles/
  _variables.scss     Shared SCSS variables/mixins
```

## Conventions

- **Ant Design theming** goes through design tokens in `theme/themeConfig.ts`
  (`ConfigProvider`). Use SCSS only for layout and for tweaks tokens can't express.
- **State**: add a slice under `store/slices/`, register its reducer in
  `store/index.ts`, and access it via the typed hooks in `store/hooks.ts`.
- **SSR styles** for AntD are handled by `@ant-design/nextjs-registry`
  (`AntdRegistry` in the root layout) — this prevents a flash of unstyled content.
- **SCSS**: component styles are `*.module.scss`; import shared tokens with
  `@use "../styles/variables" as vars;`.

> Redux Persist is intentionally omitted for now; add it per-slice (whitelist)
> if/when persistence is needed.
