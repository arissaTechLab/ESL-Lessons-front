import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/features/auth/types/auth.types'

interface ProtectedRouteProps {
  children: ReactNode
  /** When set, the visitor must hold one of these roles. */
  allow?: UserRole[]
}

/**
 * Gate for the private zones. Waits for the session restore to finish so a
 * page refresh doesn't bounce an authenticated user back to the login screen.
 */
export function ProtectedRoute({ children, allow }: ProtectedRouteProps) {
  const { user, isAuthenticated, isRestoring } = useAuthStore()
  const location = useLocation()

  if (isRestoring) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <p className="text-sm text-ink-muted">Loading your session…</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Wrong role: send them to their own zone rather than showing a dead end.
  if (allow && !allow.includes(user.role)) {
    return (
      <Navigate
        to={user.role === 'admin' ? APP_ROUTES.ADMIN : APP_ROUTES.CLIENT_MATERIALS}
        replace
      />
    )
  }

  return <>{children}</>
}
