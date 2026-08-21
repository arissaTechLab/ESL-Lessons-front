import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useAuthStore } from '@/store/auth.store'

export default function App() {
  const restore = useAuthStore((state) => state.restore)

  // Re-hydrate the session from the stored token before the guards run.
  useEffect(() => {
    void restore()
  }, [restore])

  return <RouterProvider router={router} />
}
