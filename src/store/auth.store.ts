import { create } from 'zustand'
import { clearTokens, getAccessToken, setTokens } from '@/service'
import { authService } from '@/features/auth/services/auth.service'
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/auth.types'

interface AuthState {
  user: AuthUser | null
  /** True until the initial `restore()` finishes, so guards don't flash. */
  isRestoring: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  logout: () => Promise<void>
  restore: () => Promise<void>
}

/**
 * Global session store. Tokens live in `service/token.storage` (the HTTP client
 * reads them there); this store holds the user and derived role flags.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isRestoring: true,
  isAuthenticated: false,
  isAdmin: false,

  login: async (payload) => {
    const response = await authService.login(payload)
    setTokens(response)
    set({
      user: response.user,
      isAuthenticated: true,
      isAdmin: response.user.role === 'admin',
      isRestoring: false,
    })
    return response.user
  },

  register: async (payload) => {
    const response = await authService.register(payload)
    setTokens(response)
    set({
      user: response.user,
      isAuthenticated: true,
      isAdmin: response.user.role === 'admin',
      isRestoring: false,
    })
    return response.user
  },

  logout: async () => {
    // Revoking server-side is best-effort; the local session goes either way.
    await authService.logout().catch(() => undefined)
    clearTokens()
    set({ user: null, isAuthenticated: false, isAdmin: false })
  },

  restore: async () => {
    if (!getAccessToken()) {
      set({ isRestoring: false })
      return
    }

    try {
      const user = await authService.me()
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isRestoring: false,
      })
    } catch {
      // Token expired and could not be refreshed — start clean.
      clearTokens()
      set({ user: null, isAuthenticated: false, isAdmin: false, isRestoring: false })
    }
  },
}))
