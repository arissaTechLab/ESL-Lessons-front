export interface RevenueMetrics {
  totalRevenue: number
  revenueThisMonth: number
  activeSubscriptions: number
  /** Σ over active subscriptions of price / durationMonths. */
  mrr: number
}

/** One month of the 12-month revenue chart (zero-filled by the API). */
export interface RevenuePoint {
  month: string
  label: string
  revenue: number
}

export type PaypalMode = 'manual' | 'paypal'

/** PayPal connection as embedded in the revenue overview. */
export interface PaypalState {
  connected: boolean
  accountEmail: string | null
  mode: PaypalMode
}

/** Response of `POST /admin/paypal/connect` and the status endpoint. */
export interface PaypalConnection extends PaypalState {
  connectedAt: string | null
}

/** Response of `GET /admin/revenue`. */
export interface RevenueOverview {
  metrics: RevenueMetrics
  chart: RevenuePoint[]
  paypal: PaypalState
}

export type TransactionStatus = 'paid' | 'refunded' | 'failed' | 'pending'

export type TransactionPlan = '6-months' | '12-months'

export interface TransactionUser {
  id: string
  name: string
  email: string
}

/** Row of `GET /admin/revenue/transactions` (newest first). */
export interface Transaction {
  id: string
  userId: string
  /** Null when the paying account was deleted. */
  user: TransactionUser | null
  plan: TransactionPlan
  amount: number
  currency: string
  status: TransactionStatus
  /** PayPal reference — null for manual entries. */
  reference: string | null
  paidAt: string
}

export interface TransactionFilters {
  status?: TransactionStatus
  plan?: TransactionPlan
  page?: number
  limit?: number
}
