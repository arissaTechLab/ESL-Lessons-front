import { http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  PaypalConnection,
  RevenueOverview,
  Transaction,
  TransactionFilters,
} from '@/features/admin-revenue/types/admin-revenue.types'

/** Admin-only reads and PayPal mutations. Every call requires the admin role. */
export const adminRevenueService = {
  overview: (signal?: AbortSignal) =>
    http.get<RevenueOverview>('/admin/revenue', { signal }),

  transactions: (filters: TransactionFilters = {}, signal?: AbortSignal) =>
    http.get<Paginated<Transaction>>('/admin/revenue/transactions', {
      params: { ...filters },
      signal,
    }),

  connectPaypal: (accountEmail: string) =>
    http.post<PaypalConnection>('/admin/paypal/connect', { accountEmail }),

  disconnectPaypal: () =>
    http.delete<PaypalConnection>('/admin/paypal/connect'),
}
