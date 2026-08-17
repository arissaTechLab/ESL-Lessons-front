import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { ToastViewport } from '@/shared/components'
import { useAuthStore } from '@/store/auth.store'

/** Initials avatar that opens name/email, Account and Log out. */
function AccountMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [isOpen])

  const handleLogout = async () => {
    await logout()
    navigate(APP_ROUTES.HOME, { replace: true })
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="grid size-9 place-items-center rounded-full bg-accent-300 text-xs font-bold text-ink transition hover:bg-accent-400"
      >
        {user?.initials}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-ink/10 bg-cream p-2 shadow-lg"
        >
          <div className="border-b border-ink/10 px-3 pb-3 pt-2">
            <p className="font-heading text-sm font-semibold text-ink">
              {user?.fullName}
            </p>
            <p className="truncate text-xs text-ink-muted">{user?.email}</p>
          </div>
          <Link
            to={APP_ROUTES.APP_ACCOUNT}
            onClick={() => setIsOpen(false)}
            className="mt-1 block rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-ink/5 hover:text-brand-600"
          >
            Account &amp; subscription
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink-soft transition hover:bg-ink/5 hover:text-brand-600"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Shell for the client zone: a top bar (deliberately unlike the admin sidebar)
 * with the logo and the account menu.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to={APP_ROUTES.APP}
            className="font-heading text-sm font-bold uppercase leading-none tracking-[0.15em] text-ink"
          >
            ESL
            <span className="block text-[0.6rem] font-medium tracking-[0.3em] text-ink-muted">
              Lessons
            </span>
          </Link>
          <AccountMenu />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  )
}
