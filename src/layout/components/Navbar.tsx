import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'

const NAV_LINKS = [
  { label: 'All Lessons', to: APP_ROUTES.LESSONS },
  { label: 'Grammar Index', to: APP_ROUTES.GRAMMAR_INDEX },
  { label: 'Pricing', to: APP_ROUTES.PRICING },
  { label: 'For Students', to: APP_ROUTES.FOR_STUDENTS },
] as const

const RESOURCE_LINKS = [
  { label: 'Google Slides Tutorial', to: APP_ROUTES.GOOGLE_SLIDES },
  { label: 'How to & Teaching Ideas', to: APP_ROUTES.TEACHING_IDEAS },
] as const

/** Simple tree logo mark. */
function LogoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7 text-ink"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 6 10h3l-4 6h4l-4 6h14l-4-6h4l-4-6h3L12 2Z" />
      <rect x="11" y="19" width="2" height="3" />
    </svg>
  )
}

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
        <Link
          to={APP_ROUTES.HOME}
          className="flex items-center gap-2"
          aria-label="ESL Lessons — home"
        >
          <LogoMark />
          <span className="font-heading text-sm font-bold uppercase leading-none tracking-[0.15em] text-ink">
            ESL
            <span className="block text-[0.6rem] font-medium tracking-[0.3em] text-ink-muted">
              Lessons
            </span>
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {NAV_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="uppercase tracking-wide transition hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
          <ResourcesMenu />
          {NAV_LINKS.slice(2).map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="uppercase tracking-wide transition hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
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
