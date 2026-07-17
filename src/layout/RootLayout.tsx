import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/layout/components/Navbar'
import { Footer } from '@/layout/components/Footer'

/** Reset scroll to the top whenever the route changes. */
function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}

/**
 * Application shell: persistent navbar + footer around the routed page.
 */
export function RootLayout() {
  useScrollToTop()

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
