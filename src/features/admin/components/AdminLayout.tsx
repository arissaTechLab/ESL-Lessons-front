import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

/**
 * App shell for the admin area: a persistent sidebar on desktop, a slide-over
 * drawer on mobile, and the routed page in the main content area. Rendered
 * outside the public site shell (no marketing navbar/footer).
 */
export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-cream">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink/10 bg-white md:block">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-ink/10 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-lg text-ink transition hover:bg-ink/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src="/logo_ESL.png" alt="ESL Lessons" className="h-7 w-auto" />
        </div>

        <main className="flex-1 px-6 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
