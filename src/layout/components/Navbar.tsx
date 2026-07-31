import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'

interface NavLink {
  label: string
  /** Internal route (uses `Link`); otherwise a placeholder anchor. */
  to?: string
  href?: string
}

const NAV_LINKS: readonly NavLink[] = [
  { label: 'All Lessons', to: APP_ROUTES.ALL_LESSONS },
  { label: 'Grammar Index', to: APP_ROUTES.GRAMMAR_INDEX },
]

const RESOURCE_LINKS = [
  { label: 'Google Slides Tutorial', to: APP_ROUTES.GOOGLE_SLIDES },
  { label: 'How to & Teaching Ideas', to: APP_ROUTES.TEACHING_IDEAS },
] as const

/** "Resources" nav item with a hover/focus dropdown submenu. */
function ResourcesMenu() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 uppercase tracking-wide transition hover:text-brand-600 group-focus-within:text-brand-600 group-hover:text-brand-600"
        aria-haspopup="menu"
      >
        Resources
        <svg
          viewBox="0 0 24 24"
          className="size-3.5 transition group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Menu (pt-3 forms an invisible hover bridge to the trigger) */}
      <div className="invisible absolute left-1/2 top-full z-30 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="w-64 rounded-xl border border-ink/10 bg-cream p-2 shadow-lg">
          {RESOURCE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-lg px-3 py-2 text-sm font-medium normal-case tracking-normal text-ink-soft transition hover:bg-ink/5 hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link to={APP_ROUTES.HOME} aria-label="ESL Lessons — home">
          <img
            src="/logo_ESL.png"
            alt="ESL Lessons"
            className="h-9 w-auto"
          />
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="uppercase tracking-wide transition hover:text-brand-600"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="uppercase tracking-wide transition hover:text-brand-600"
              >
                {link.label}
              </a>
            ),
          )}
          <ResourcesMenu />
          <Link
            to={APP_ROUTES.PRICING}
            className="uppercase tracking-wide transition hover:text-brand-600"
          >
            Pricing
          </Link>
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          <Link
            to={APP_ROUTES.LOGIN}
            className={buttonVariants('tertiary', 'sm')}
          >
            Log in
          </Link>
          <Link
            to={APP_ROUTES.SIGNUP}
            className={buttonVariants('secondary', 'sm')}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
