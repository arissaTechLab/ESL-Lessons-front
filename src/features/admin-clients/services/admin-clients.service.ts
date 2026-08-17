import { http } from '@/service'
import type {
  AdminClientFilters,
  AdminClientsResult,
} from '@/features/admin-clients/types/admin-clients.types'

export const adminClientsService = {
  list: (filters: AdminClientFilters = {}, signal?: AbortSignal) =>
    http.get<AdminClientsResult>('/admin/clients', {
      params: { ...filters },
      signal,
    }),
}
