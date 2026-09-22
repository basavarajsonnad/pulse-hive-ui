# Pulse Hive UI

Next.js (App Router) + Ant Design + Redux Toolkit + SCSS.

## Stack

| Concern         | Choice                      |
| --------------- | --------------------------- |
| Framework       | Next.js 16 (App Router)     |
| Language        | TypeScript                  |
| UI library      | Ant Design 6                |
| State           | Redux Toolkit + React-Redux |
| Styling         | SCSS (CSS Modules)          |
| Package manager | pnpm                        |
| Node            | 22 (see `.nvmrc`)           |

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

| Command      | Description                |
| ------------ | -------------------------- |
| `pnpm dev`   | Start the dev server       |
| `pnpm build` | Production build           |
| `pnpm start` | Serve the production build |
| `pnpm lint`  | Run ESLint                 |

## Project layout

```
app/                  App Router routes
  layout.tsx          Root layout: StoreProvider → AntdRegistry → ConfigProvider
  globals.scss        Global styles
  (portal)/           Route group: sidebar shell around all portal pages
    customers/tenant-setup/tenants/   Tenants page (/customers/tenant-setup/tenants)
components/
  layout/             App shell only: Sidebar, TabNav, top bar, filter bar
features/
  Tenants/            Everything for tenants in one place: api.ts (GET/POST /api/tenants),
                      types.ts, utils.tsx (API -> table mapping, columns),
                      TenantsTable / TenantForm, styles/
  Login/              slice.ts: authToken + user details (used by axios baseQuery)
shared/
  Notification/       Success/error toasts driven by redux (setNotification)
  hooks/
    useDateRangeFilter.ts   Date-range chip (kept in the URL), shared by layout + Tenants
axiosconfig/          axiosInstance, baseQuery (auth + refresh), interceptor
redux/
  store.ts            Singleton store + RootState / AppDispatch types
  rootReducer.ts      Slice + API reducers
  hooks.ts            Typed useAppSelector / useAppDispatch
utils/constants/      apiConstants, appConstants, urlConstants
theme/
  themeConfig.ts      Ant Design design tokens (ConfigProvider)
styles/
  _variables.scss     Shared SCSS variables/mixins
```

## Conventions

- **Ant Design theming** goes through design tokens in `theme/themeConfig.ts`
  (`ConfigProvider`). Use SCSS only for layout and for tweaks tokens can't express.
- **API calls**: every feature has an `api.ts` (`createApi` + `axiosBaseQuery()`).
  Register its `reducerPath`/`reducer` in `redux/rootReducer.ts` and its
  `middleware` in `redux/store.ts`. Endpoint paths live in `utils/constants/urlConstants.ts`.
  Set `BASE_URL` in `.env`; `next.config.ts` proxies `/api/*` to it (same-origin, no CORS).
- **State**: a slice is only for state the axios layer needs (login, notification).
  Everything else is `useState`, or the URL when several layouts share it. The
  redux `Provider` lives in `app/(portal)/layout.tsx` (a client layout).
- **SSR styles** for AntD are handled by `@ant-design/nextjs-registry`
  (`AntdRegistry` in the root layout) — this prevents a flash of unstyled content.
- **SCSS**: component styles are `*.module.scss`; import shared tokens with
  `@use "../styles/variables" as vars;`.

> Redux Persist is intentionally omitted for now; add it per-slice (whitelist)
> if/when persistence is needed.
