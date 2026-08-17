/** Mirrors the backend `Role` enum — decides whether login lands on /app or /admin. */
export type UserRole = 'admin' | 'client'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  fullName: string
  /** Two-letter avatar label used by the client account menu. */
  initials: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  acceptedTerms?: boolean
}
