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
| Hosting         | Static export → S3 + CloudFront |

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

| Command      | Description                                    |
| ------------ | ---------------------------------------------- |
| `pnpm dev`   | Start the dev server                           |
| `pnpm build` | Static export build → `dist/` (HTML/CSS/JS)    |
| `pnpm lint`  | Run ESLint                                     |

> `next start` is not used: the app is a **static export** (`output: 'export'`),
> so there is no Node server to serve. To preview the built output locally,
> serve the folder statically, e.g. `npx serve dist`.

## Project layout

```
app/                  App Router routes
  layout.tsx          Root layout: AntdRegistry → ConfigProvider
  page.tsx            `/` → client redirect to the tenants page
  globals.scss        Global styles
  (portal)/           Route group: sidebar shell around all portal pages
    customers/page.tsx                 `/customers` → client redirect
    customers/tenant-setup/page.tsx    `/customers/tenant-setup` → client redirect
    customers/tenant-setup/tenants/    Tenants page (/customers/tenant-setup/tenants)
components/
  layout/             App shell only: Sidebar, TabNav, top bar, filter bar
features/
  Tenants/            Everything for tenants in one place: api.ts (GET/POST /api/v1/tenants),
                      adapters.ts (Hive backend -> UI shape mapping), types.ts,
                      utils.tsx (table mapping, columns), TenantsTable / TenantForm, styles/
  Login/              slice.ts: authToken + user details (used by axios baseQuery)
shared/
  RedirectToTenants.tsx   Client redirect used by the landing/redirect pages
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
  Because the app is a static export, the browser calls the Hive backend
  **directly** at `NEXT_PUBLIC_API_BASE_URL` (there is no server-side proxy).
  Backend↔UI shape differences are handled client-side in the feature's
  `adapters.ts` and applied via RTK Query `transformResponse` / request builders.
- **Redirects**: `redirects()`/`rewrites()` are unavailable in static export, so
  route redirects are done client-side (`shared/RedirectToTenants.tsx` + a thin
  `page.tsx` per source route).
- **State**: a slice is only for state the axios layer needs (login, notification).
  Everything else is `useState`, or the URL when several layouts share it. The
  redux `Provider` lives in `app/(portal)/layout.tsx` (a client layout).
- **SSR styles** for AntD are handled by `@ant-design/nextjs-registry`
  (`AntdRegistry` in the root layout) — this prevents a flash of unstyled content.
- **SCSS**: component styles are `*.module.scss`; import shared tokens with
  `@use "../styles/variables" as vars;`.

> Redux Persist is intentionally omitted for now; add it per-slice (whitelist)
> if/when persistence is needed.

## Environment variables

Values are loaded from `.env*` at **build time** and (for `NEXT_PUBLIC_*`) inlined
into the bundle — a static export has no runtime server, so nothing is read at
runtime. Locally, create `.env.local`; CI copies `.env.<env>` to `.env.local`
before building.

| Variable                    | Scope    | Purpose                                             |
| --------------------------- | -------- | --------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`  | browser  | Origin of the Hive backend the app calls directly   |
| `NEXT_PUBLIC_API_VERSION`   | browser  | Optional API version prefix                         |
| `NEXT_PUBLIC_LD_CLIENT_ID`  | browser  | LaunchDarkly client-side ID (per environment)       |

## Deployment

`pnpm build` runs `next build` with `output: 'export'` and emits static
HTML/CSS/JS to `dist/`. CI (`.github/workflows/deploy-dev.yml`) uploads `dist/`
to S3 and serves it via CloudFront — there is no Node server in production.

Because the browser now calls the backend cross-origin, the Hive backend must
allow the CloudFront origin via **CORS** with credentials (and `SameSite=None;
Secure` cookies for auth). CloudFront should also route unknown paths to
`index.html` (SPA fallback) so client-side routes resolve.
