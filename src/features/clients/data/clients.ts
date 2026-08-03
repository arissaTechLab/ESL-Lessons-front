import type { Client, SubscriptionPlan } from '../types/client.types'

/**
 * Mocked clients. Stands in for real data until sign up + the client zone are
 * wired to the backend.
 */
export const CLIENTS: readonly Client[] = [
  {
    id: 'c-emily',
    firstName: 'Emily',
    lastName: 'Roberts',
    email: 'emily.roberts@example.com',
    registeredAt: '2025-01-12',
    plan: '12-month',
    status: 'active',
    renewsAt: '2026-01-12',
  },
  {
    id: 'c-carlos',
    firstName: 'Carlos',
    lastName: 'Mendez',
    email: 'carlos.mendez@example.com',
    registeredAt: '2025-02-03',
    plan: '6-month',
    status: 'active',
    renewsAt: '2025-08-03',
  },
  {
    id: 'c-sophie',
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie.laurent@example.com',
    registeredAt: '2024-11-20',
    plan: '12-month',
    status: 'expired',
    renewsAt: '2025-11-20',
  },
  {
    id: 'c-david',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@example.com',
    registeredAt: '2025-03-18',
    plan: null,
    status: 'free',
    renewsAt: null,
  },
  {
    id: 'c-marta',
    firstName: 'Marta',
    lastName: 'Nowak',
    email: 'marta.nowak@example.com',
    registeredAt: '2025-04-01',
    plan: '6-month',
    status: 'active',
    renewsAt: '2025-10-01',
  },
  {
    id: 'c-james',
    firstName: 'James',
    lastName: 'O’Brien',
    email: 'james.obrien@example.com',
    registeredAt: '2024-09-05',
    plan: '6-month',
    status: 'expired',
    renewsAt: '2025-03-05',
  },
  {
    id: 'c-yuki',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'yuki.tanaka@example.com',
    registeredAt: '2025-04-22',
    plan: null,
    status: 'free',
    renewsAt: null,
  },
  {
    id: 'c-ana',
    firstName: 'Ana',
    lastName: 'Silva',
    email: 'ana.silva@example.com',
    registeredAt: '2025-02-27',
    plan: '12-month',
    status: 'active',
    renewsAt: '2026-02-27',
  },
]

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  '6-month': '6-Month Plan',
  '12-month': '12-Month Plan',
}

export function planLabel(plan: SubscriptionPlan | null): string {
  return plan ? PLAN_LABELS[plan] : '—'
}

export function formatClientDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
