import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { ToastViewport } from '@/shared/components'
import { useAuthStore } from '@/store/auth.store'

const NAV_ITEMS = [
  { label: 'Dashboard', to: APP_ROUTES.ADMIN, end: true },
  { label: 'Lessons', to: APP_ROUTES.ADMIN_LESSONS, end: false },
  { label: 'Taxonomy', to: APP_ROUTES.ADMIN_TAXONOMY, end: false },
  { label: 'Blog', to: APP_ROUTES.ADMIN_BLOG, end: false },
  { label: 'Clients', to: APP_ROUTES.ADMIN_CLIENTS, end: false },
  { label: 'Revenue', to: APP_ROUTES.ADMIN_REVENUE, end: false },
] as const

/**
 * Shell for the admin panel: a sticky left sidebar that stays put while the
 * content scrolls, with Log out pinned to the bottom.
 */
export function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate(APP_ROUTES.HOME, { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-ink/10 bg-white px-4 py-5">
        <div className="px-2">
          <p className="font-heading text-sm font-bold uppercase leading-none tracking-[0.15em] text-ink">
            ESL
            <span className="block text-[0.6rem] font-medium tracking-[0.3em] text-ink-muted">
              Lessons
            </span>
          </p>
          <p className="mt-3 text-xs text-ink-muted">Admin panel</p>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink/10 pt-3">
          <p className="truncate px-3 text-xs text-ink-muted">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-brand-500 hover:text-brand-600"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="ml-60 px-8 py-8">
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  )
}
