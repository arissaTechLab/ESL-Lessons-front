export type SubscriptionPlan = '6-months' | '12-months'

/**
 * active  → paid, subscription currently valid
 * expired → previously paid, subscription lapsed
 * free    → registered, never subscribed
 */
export type ClientStatus = 'active' | 'expired' | 'free'

export interface Client {
  id: string
  // ── From sign up ──────────────────────────────────────────────
  firstName: string
  lastName: string
  fullName: string
  email: string
  /** ISO date the account was created (sign up). */
  registeredAt: string
  // ── From the client zone / payments ───────────────────────────
  /** Current plan, or null if they never subscribed. */
  plan: SubscriptionPlan | null
  status: ClientStatus
  /** ISO date the subscription renews (active) or ended (expired). */
  renewsAt: string | null
}
