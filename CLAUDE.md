# CLAUDE.md — ESL Lessons Front

Guidance for AI assistants and developers working in this repository.

## Project purpose

Frontend for the **ESL Lessons** platform — a web app to browse and take
English-as-a-Second-Language lessons.

**The UI is wired to the real backend** (`ESL-Lessons-back`, NestJS + MongoDB).
Nothing on screen is hardcoded fixture data — the catalogue, taxonomy, blog,
FAQs, testimonials, stats, pricing and every private screen read from the API.

The three zones of the functional guide are all implemented:

| Zone         | Routes                                             |
| ------------ | -------------------------------------------------- |
| Public web   | `/`, `/lessons`, `/categories/:slug`, `/free-lessons`, `/lessons/:slug`, `/grammar-index`, `/pricing`, `/for-students`, `/about`, `/faq`, resources, legal |
| Client zone  | `/app` (Materials), `/app/materials/:slug`, `/app/account` |
| Admin panel  | `/admin` (Dashboard), `/admin/lessons`, `/admin/taxonomy`, `/admin/blog`, `/admin/clients`, `/admin/revenue` |

Login routes by role: `admin` → `/admin`, `client` → `/app`. Both zones sit
behind `ProtectedRoute`.

## ⚠️ Architecture: read this first

This project follows **Screaming Architecture** (feature-first, not layer-first).
The full guide is at **[`docs/SCREAMING-ARCHITECTURE.md`](docs/SCREAMING-ARCHITECTURE.md)** —
**read it before adding or moving any code.** The structure must "scream" the
business domain, not the framework.

Non-negotiable rules (summary — the doc is the source of truth):

- Code lives under `src/features/<domain>/` (e.g. `lessons/`, `landing/`), not
  under global `components/` or `pages/` folders.
- Each feature exposes a **public API** via its `index.ts`. Import features
  **only** through that barrel — never reach into another feature's internals
  (`@/features/lessons/components/LessonCard` is forbidden from outside the
  feature; use `@/features/lessons`).
- Genuinely reusable, business-agnostic code goes in `src/shared/`.
- Global concerns have dedicated folders: `config/`, `router/`, `store/`,
  `layout/`.

## Tech stack

| Concern      | Choice                                             |
| ------------ | -------------------------------------------------- |
| Build / dev  | Vite 8                                             |
| UI           | React 19                                           |
| Language     | TypeScript 5.9 (strict)                            |
| Styling      | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first)   |
| Routing      | React Router DOM 7                                 |
| Global state | Zustand 5                                          |
| Quality      | ESLint 10 (flat config) + Prettier                 |

> **TypeScript version note:** pinned to 5.9 on purpose. TypeScript 7 (the native
> compiler) is released but `typescript-eslint` does not support it yet
> (`peer: typescript <6.1.0`). Bump to TS 7 only once `typescript-eslint`
> declares support, or `npm run lint` will crash.

## Commands

```bash
npm run dev          # start Vite dev server (http://localhost:5173)
npm run build        # type-check (tsc -b) + production build
npm run preview      # serve the production build locally
npm run typecheck    # tsc -b (project references — DON'T use plain `tsc --noEmit`)
npm run lint         # ESLint
npm run lint:fix     # ESLint with --fix
npm run format       # Prettier write
```

## Directory map

```text
src/
├── config/         # App-wide constants (routes.constants.ts) — single source of truth
├── router/         # React Router setup; features plug in via their public API
├── store/          # Zustand global stores (theme.store.ts, auth.store.ts)
├── service/        # 🌐 Global API layer: http client, ApiError, token storage
├── interface/      # Transport-level types shared by every endpoint (Paginated…)
├── hooks/          # Global hooks (useAsync)
├── shared/         # Reusable, business-agnostic UI (AsyncSection, Modal, MultiSelect…)
├── layout/         # Three shells: RootLayout (public), AppLayout (client), AdminLayout
└── features/
    ├── landing/          # 🏠 Landing + editable marketing content
    ├── lessons/          # 📚 Public catalogue, filters, lesson detail, comments
    ├── grammar/          # 🔤 Grammar Index
    ├── pricing/          # 💲 Plans
    ├── students/         # 🎓 For Students
    ├── auth/             # 🔐 Log in / sign up / forgot password + ProtectedRoute
    ├── materials/        # 📂 Client zone: Materials + folders
    ├── account/          # ⚙️  Client account & subscription
    ├── admin-dashboard/  # 📊 Admin: metrics and charts
    ├── admin-lessons/    # ✏️  Admin: lessons table + form
    ├── admin-taxonomy/   # 🏷️  Admin: categories, levels, topics
    ├── admin-blog/       # 📰 Admin: articles
    ├── admin-clients/    # 👥 Admin: client directory
    ├── admin-revenue/    # 💰 Admin: PayPal, revenue, transactions
    └── resources/, faq/, about/, legal/
```

Each feature owns its `services/` (API calls) and `types/` (domain types) and
exposes them through its `index.ts` barrel. **Import features only through that
barrel.**

Two cross-feature contracts worth knowing:

- `@/features/lessons` exports `LessonCard` (the tile every list reuses) and
  `LessonCardModel` (its type). Materials wraps it rather than re-implementing it.
- `@/features/admin-taxonomy` exports `taxonomyService`; the admin lesson form
  populates its category/level/topic selects from it, never from a constant —
  the guide is explicit that Taxonomy feeds that form.

## Talking to the API

- **One base URL:** `VITE_API_URL` (see `.env.example`), read only by
  `src/service/http.client.ts`. No component builds a URL by hand.
- **`http`** is a thin typed wrapper over `fetch`: it attaches the bearer token,
  normalises errors into `ApiError`, and transparently retries once after
  refreshing an expired access token. Concurrent 401s share one refresh.
- **Tokens** live in `src/service/token.storage.ts` — the single module both the
  HTTP client and the auth store read, which keeps them from importing each other.
- **Feature services** (`features/<domain>/services/*.service.ts`) are the only
  callers of `http`. Components call services, never `fetch`.
- **Data fetching in components:** `useAsync(loader, deps)` + `<AsyncSection>`,
  which renders the loading / error / empty / ready states consistently.
- **Auth state:** `useAuthStore` (Zustand). `restore()` runs once in `App.tsx`;
  `ProtectedRoute` waits for it so a refresh doesn't bounce a logged-in user.

## Conventions

- **Path alias:** `@/*` → `src/*` (configured in `tsconfig.app.json` and
  `vite.config.ts` — keep both in sync).
- **Type-only imports:** use `import type { ... }` (`verbatimModuleSyntax` is on).
- **Strict TS:** `noUncheckedIndexedAccess`, `noUnusedLocals`, etc. are enabled —
  don't loosen them.
- **Styling:** Tailwind utilities only; design tokens live in `src/index.css`
  under `@theme` (there is **no** `tailwind.config.js` in v4).
- **Dark mode:** class-based (`.dark` on `<html>`), driven by `theme.store.ts`;
  the pre-paint script in `index.html` prevents a flash of the wrong theme.
- **Commits:** Conventional Commits.

## Adding a new feature (checklist)

1. `src/features/<name>/{components,pages}/` + `index.ts`.
2. Implement components/pages; expose only what's needed from `index.ts`.
3. Add the route to `src/config/routes.constants.ts`, then wire it in
   `src/router/index.tsx`.
4. Import other features **only** via their public `index.ts`.

See `docs/SCREAMING-ARCHITECTURE.md` for the full checklist and rationale.
