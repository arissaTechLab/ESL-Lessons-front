# CLAUDE.md — ESL Lessons Front

Guidance for AI assistants and developers working in this repository.

## Project purpose

Frontend for the **ESL Lessons** platform — a web app to browse and take
English-as-a-Second-Language lessons. This repo currently contains the starter
scaffold and a landing page.

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
├── store/          # Zustand global stores (theme.store.ts)
├── shared/         # Reusable, business-agnostic components (ThemeToggle)
├── layout/         # App shell: RootLayout, Navbar, Footer
└── features/
    ├── landing/    # 🏠 Landing page (Hero, FeaturesSection, LandingPage)
    └── lessons/    # 📚 Lessons domain (LessonCard, LessonsSection, data, types)
```

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
