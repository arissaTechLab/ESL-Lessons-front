/** Mocked signed-in customer + their subscription (from sign up / payments). */
export const CURRENT_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  memberSince: '2025-02-27',
  plan: 'The Annual Pass',
  planStatus: 'active' as 'active' | 'expired',
  renewsAt: '2026-02-27',
}

export function formatUserDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
