import { http } from '@/service'
import type { AdminDashboardOverview } from '@/features/admin-dashboard/types/admin-dashboard.types'

/** Admin-only reads. Every call requires a bearer token with the admin role. */
export const adminDashboardService = {
  overview: (signal?: AbortSignal) =>
    http.get<AdminDashboardOverview>('/admin/dashboard', { signal }),
}
