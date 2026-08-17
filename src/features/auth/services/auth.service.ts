import { http } from '@/service'
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/auth.types'

/** Calls behind the Log in / Sign up / Forgot password screens. */
export const authService = {
  login: (payload: LoginPayload) =>
    http.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    http.post<AuthResponse>('/auth/register', payload),

  logout: () => http.post<void>('/auth/logout'),

  me: () => http.get<AuthUser>('/auth/me'),

  forgotPassword: (email: string) =>
    http.post<{ resetToken?: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    http.post<void>('/auth/reset-password', { token, password }),
}
