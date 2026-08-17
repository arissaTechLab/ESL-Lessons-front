# 📚 ESL Lessons — Front

Modern frontend starter for the **ESL Lessons** platform. Built with Vite,
React 19, TypeScript, and Tailwind CSS v4, organized with
**[Screaming Architecture](docs/SCREAMING-ARCHITECTURE.md)** (feature-first).

## ✨ Stack

- **Vite 8** — build tool & dev server
- **React 19** + **TypeScript 5.9** (strict)
- **Tailwind CSS v4** — CSS-first engine, no `tailwind.config.js`
- **React Router DOM 7** — routing
- **Zustand 5** — global state (theme)
- **ESLint 10** (flat config) + **Prettier**

## 📋 Prerequisites

- **Node.js ≥ 20.19** (or ≥ 22.12) — this repo is developed on Node 22
- **npm** (ships with Node)

## 🚀 Setup

```bash
git clone <repo-url>
cd ESL-Lessons-front
npm install
cp .env.example .env   # point VITE_API_URL at the backend
npm run dev            # http://localhost:5173
```

> **The app needs the API running.** Start `ESL-Lessons-back`
> (`npm run start:dev`, http://localhost:3000/api) and seed it once with
> `npm run seed` — otherwise every section renders its empty state.

## 📜 Scripts

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server with HMR                  |
| `npm run build`     | Type-check + production build to `dist/`       |
| `npm run preview`   | Preview the production build locally           |
| `npm run typecheck` | Type-check only (`tsc -b`)                      |
| `npm run lint`      | Lint with ESLint                               |
| `npm run lint:fix`  | Lint and auto-fix                              |
| `npm run format`    | Format `src/` with Prettier                    |

## 🏗️ Project structure

```text
src/
├── config/       # App constants (routes)
├── router/       # React Router configuration
├── store/        # Zustand global stores (theme, auth)
├── service/      # 🌐 API layer (http client, errors, token storage)
├── interface/    # Transport-level shared types
├── hooks/        # Global hooks (useAsync)
├── shared/       # Reusable, business-agnostic components
├── layout/       # App shell (Navbar, Footer, RootLayout)
└── features/     # Business domains — the heart of the app
    ├── landing/  # 🏠 Landing page
    ├── lessons/  # 📚 Lessons
    ├── auth/     # 🔐 Log in / sign up / forgot password
    ├── dashboard/# 🚪 Private zones (/app, /admin)
    └── …         # resources, faq, about, legal
```

The architecture is **feature-first**: the folder tree tells you what the app
_does_, not which libraries it uses. Read
**[docs/SCREAMING-ARCHITECTURE.md](docs/SCREAMING-ARCHITECTURE.md)** before
contributing.

## 🎨 Styling & theming

- Tailwind CSS v4 utilities; design tokens (`brand` palette, fonts) live in
  `src/index.css` under `@theme`.
- Light/dark mode is class-based and persisted in `localStorage`; the toggle
  lives in the navbar and is powered by `src/store/theme.store.ts`.

## 🔐 Environment variables

Only variables prefixed with `VITE_` are exposed to the client. See
`.env.example`. **Never commit real secrets** — `.env` is git-ignored.

| Variable       | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `VITE_API_URL` | Backend base URL, including `/api`. Read only by `src/service/http.client.ts`. |

## 🌐 Data flow

Components never call `fetch`. They call a **feature service**
(`features/<domain>/services/*.service.ts`), which calls the shared `http`
client. The client attaches the bearer token, normalises failures into
`ApiError`, and silently refreshes an expired access token once before retrying.

In components, `useAsync(loader, deps)` drives `<AsyncSection>`, which renders
loading / error / empty / ready states the same way everywhere.

## 📦 Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve dist/ to verify
```

## 📄 License

Private — © ESL Lessons.
