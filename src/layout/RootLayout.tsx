import { Outlet } from 'react-router-dom'
import { Navbar } from '@/layout/components/Navbar'
import { Footer } from '@/layout/components/Footer'

/**
 * Application shell: persistent navbar + footer around the routed page.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
