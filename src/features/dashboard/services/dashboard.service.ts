import { http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  AdminDashboard,
  Material,
  Subscription,
} from '@/features/dashboard/types/dashboard.types'

/** Private-zone reads. Every call requires a bearer token. */
export const dashboardService = {
  subscription: (signal?: AbortSignal) =>
    http.get<Subscription | null>('/me/subscription', { signal }),

  materials: (
    params: { q?: string; tab?: 'all' | 'free' | 'paid'; limit?: number } = {},
    signal?: AbortSignal,
  ) => http.get<Paginated<Material>>('/me/materials', { params: { ...params }, signal }),

  adminOverview: (signal?: AbortSignal) =>
    http.get<AdminDashboard>('/admin/dashboard', { signal }),
}
