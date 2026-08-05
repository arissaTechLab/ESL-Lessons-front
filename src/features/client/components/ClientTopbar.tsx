import { Link, useNavigate } from 'react-router-dom'
import { useDropdown } from '@/shared/hooks/useDropdown'
import { APP_ROUTES } from '@/config/routes.constants'
import { CURRENT_USER } from '../data/account'

function AccountMenu() {
  const { open, setOpen, ref } = useDropdown()
  const navigate = useNavigate()
  const initials =
    `${CURRENT_USER.firstName[0] ?? ''}${CURRENT_USER.lastName[0] ?? ''}`.toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-ink/5"
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent-300 text-sm font-bold text-ink">
          {initials}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`size-4 text-ink-soft transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
          <div className="border-b border-ink/10 px-3 pb-2">
            <p className="text-sm font-semibold text-ink">
              {CURRENT_USER.firstName} {CURRENT_USER.lastName}
            </p>
            <p className="truncate text-xs text-ink-muted">
              {CURRENT_USER.email}
            </p>
          </div>
          <Link
            to={APP_ROUTES.CLIENT_ACCOUNT}
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-ink/5 hover:text-ink"
          >
            Account &amp; subscription
          </Link>
          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.HOME)}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink-soft transition hover:bg-ink/5 hover:text-ink"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export function ClientTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to={APP_ROUTES.CLIENT_MATERIALS} aria-label="Home">
          <img src="/logo_ESL.png" alt="ESL Lessons" className="h-8 w-auto" />
        </Link>

        <AccountMenu />
      </div>
    </header>
  )
}
