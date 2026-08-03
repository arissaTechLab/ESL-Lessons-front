import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Reads a one-off toast message passed via navigation state (e.g. from a form
 * on save), clears it from history, and auto-dismisses it.
 */
export function useNavigationToast() {
  const location = useLocation()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(() => {
    const state = location.state as { toast?: string } | null
    return state?.toast ?? null
  })

  // Clear the navigation state so a refresh doesn't replay the toast.
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location, navigate])

  // Auto-dismiss (setState runs in a timer callback, not synchronously).
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  return toast
}
