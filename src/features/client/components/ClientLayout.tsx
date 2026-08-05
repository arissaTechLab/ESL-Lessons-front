import { Outlet } from 'react-router-dom'
import { ClientTopbar } from './ClientTopbar'

/**
 * Shell for the logged-in customer zone: a top navigation bar (distinct from
 * the admin's sidebar) over a centered content area.
 */
export function ClientLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <ClientTopbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
