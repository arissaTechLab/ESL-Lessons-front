import type { SubscriptionPlan } from '@/features/clients'

export type TransactionStatus = 'paid' | 'refunded' | 'failed' | 'pending'

/** A payment record synced from PayPal (PayPal is the source of truth). */
export interface Transaction {
  id: string
  userId: string
  /** The paying client, or null if the account was deleted. */
  user: { id: string; name: string; email: string } | null
  plan: SubscriptionPlan
  amount: number
  /** ISO 4217 code, e.g. "USD". */
  currency: string
  status: TransactionStatus
  /** PayPal transaction reference, or null for manual records. */
  reference: string | null
  /** ISO date (YYYY-MM-DD), or null while pending/failed. */
  paidAt: string | null
}
