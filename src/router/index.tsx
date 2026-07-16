import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layout'
import { APP_ROUTES } from '@/config/routes.constants'
import { LandingPage } from '@/features/landing'

/**
 * Application router. Each feature plugs its pages in here through its
 * public API. Add new routes alongside `APP_ROUTES` in config first.
 */
export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: <RootLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
])
