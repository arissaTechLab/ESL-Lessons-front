import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to={APP_ROUTES.HOME}
          className="flex items-center gap-2 font-semibold"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-lg text-white shadow-sm">
            📚
          </span>
          <span className="text-lg tracking-tight text-slate-900 dark:text-white">
            ESL{' '}
            <span className="text-brand-600 dark:text-brand-400">Lessons</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a
            href="#lessons"
            className="transition hover:text-brand-600 dark:hover:text-brand-400"
          >
            Lessons
          </a>
          <a
            href="#features"
            className="transition hover:text-brand-600 dark:hover:text-brand-400"
          >
            Features
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
