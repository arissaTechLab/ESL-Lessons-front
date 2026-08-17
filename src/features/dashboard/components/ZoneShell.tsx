import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { useAuthStore } from '@/store/auth.store'

interface ZoneShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

/**
 * Minimal top bar shared by both private zones: brand, the signed-in user's
 * initials, and log out. The full client top-bar / admin sidebar described in
 * the functional guide are still to be built.
 */
export function ZoneShell({ title, subtitle, children }: ZoneShellProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate(APP_ROUTES.HOME, { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to={APP_ROUTES.HOME}
            className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-ink"
          >
            ESL Lessons
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="grid size-9 place-items-center rounded-full bg-accent-300 text-xs font-bold text-ink"
              title={user?.email}
            >
              {user?.initials}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink-soft transition hover:border-brand-500 hover:text-brand-600"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-heading text-3xl font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}
