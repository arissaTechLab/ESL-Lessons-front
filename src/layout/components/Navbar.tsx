import { Link } from 'react-router-dom'
import { Button } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'

const NAV_LINKS = [
  { label: 'All Lessons', href: '#lessons' },
  { label: 'Grammar Index', href: '#grammar' },
  { label: 'Resources', href: '#resources' },
  { label: 'Pricing', href: '#pricing' },
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="uppercase tracking-wide transition hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          <Button variant="tertiary" size="sm">
            Log in
          </Button>
          <Button variant="secondary" size="sm">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}
