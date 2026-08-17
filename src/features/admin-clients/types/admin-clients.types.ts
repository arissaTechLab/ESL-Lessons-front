import type { Paginated } from '@/interface'

export type ClientPlan = '6-months' | '12-months'

export type ClientStatus = 'active' | 'expired' | 'free'

/** One row of the admin Clients table. */
export interface AdminClient {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  registeredAt: string
  plan: ClientPlan | null
  status: ClientStatus
  renewsAt: string | null
}

/** Headline numbers for the three summary tiles. */
export interface AdminClientsSummary {
  totalClients: number
  activeSubscriptions: number
  freeAccounts: number
}

/** `GET /admin/clients` — paginated rows plus the global summary. */
export interface AdminClientsResult extends Paginated<AdminClient> {
  summary: AdminClientsSummary
}

/** Query accepted by `GET /admin/clients`. */
export interface AdminClientFilters {
  q?: string
  plan?: ClientPlan
  status?: ClientStatus
  page?: number
  limit?: number
}
