import type { SubscriptionPlan } from '../types/client.types'

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  '6-months': 'The Semester Pass',
  '12-months': 'The Annual Pass',
}

export function planLabel(plan: SubscriptionPlan | null): string {
  return plan ? PLAN_LABELS[plan] : '—'
}

export function formatClientDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
