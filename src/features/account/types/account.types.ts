import type { AuthUser } from '@/features/auth'

export type SubscriptionPlanKey = '6-months' | '12-months'

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending'

/**
 * The signed-in client's plan. Owned here because Account is the screen that
 * renders it; Materials only needs to know whether the library is unlocked.
 */
export interface Subscription {
  id: string
  plan: SubscriptionPlanKey
  status: SubscriptionStatus
  startsAt: string
  endsAt: string
  /** Mirrors `endsAt` — what the UI labels the renewal date. */
  renewsAt: string
  price: number
  currency: string
}

/** Response of `GET /api/me/account`. */
export interface AccountSummary {
  user: AuthUser
  subscription: Subscription | null
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  email?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
