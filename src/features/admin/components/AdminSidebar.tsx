import { NavLink, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'

const DashboardIcon = () => (
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </>
)

const LessonsIcon = () => (
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </>
)

const BlogIcon = () => (
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h8M8 9h1" />
  </>
)

const ClientsIcon = () => (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>
)

interface NavItem {
  to: string
  label: string
  Icon: React.FC
  /** Match the route exactly (used for the index route). */
  end?: boolean
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: APP_ROUTES.ADMIN, label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: APP_ROUTES.ADMIN_LESSONS, label: 'Lessons', Icon: LessonsIcon },
  { to: APP_ROUTES.ADMIN_BLOG, label: 'Blog', Icon: BlogIcon },
  { to: APP_ROUTES.ADMIN_CLIENTS, label: 'Clients', Icon: ClientsIcon },
]

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()

  // Mocked — real sign-out comes with the auth backend.
  const handleLogout = () => navigate(APP_ROUTES.LOGIN)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink/10 px-5 py-4">
        <img src="/logo_ESL.png" alt="ESL Lessons" className="h-8 w-auto" />
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Admin panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
              }`
            }
          >
            <NavIcon>
              <Icon />
            </NavIcon>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink"
        >
          <NavIcon>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5M21 12H9" />
          </NavIcon>
          Log out
        </button>
      </div>
    </div>
  )
}
