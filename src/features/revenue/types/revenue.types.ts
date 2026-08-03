export type TransactionStatus = 'paid' | 'refunded' | 'failed'

export interface Transaction {
  id: string
  /** PayPal transaction reference (source of truth lives in PayPal). */
  paypalRef: string
  clientName: string
  /** Plan label, e.g. "12-Month Plan". */
  plan: string
  /** Amount in USD. */
  amount: number
  status: TransactionStatus
  /** ISO date (YYYY-MM-DD). */
  date: string
}
