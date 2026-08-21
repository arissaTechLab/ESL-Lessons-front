import { http } from '@/service'
import type { PricingPlan } from '@/features/pricing/types/pricing.types'

/** ---------- What the API actually sends ---------- */

interface ApiPlan {
  id: string
  name: string
  description: string
  price: number
  period: string
  billingNote: string
  features: string[]
  ctaLabel: string
  badge: string | null
  isFeatured: boolean
}

/** ---------- Mapping onto the shape the components already use ---------- */

/** `72` → `$72`, `72.5` → `$72.50` — the cards render the price as a string. */
const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)

export function toPricingPlan(dto: ApiPlan): PricingPlan {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    price: formatPrice(dto.price),
    period: dto.period,
    billingNote: dto.billingNote,
    features: dto.features,
    ctaLabel: dto.ctaLabel,
    badge: dto.badge ?? undefined,
    featured: dto.isFeatured,
  }
}

/** ---------- The public pricing plans ---------- */

export const pricingService = {
  list: (signal?: AbortSignal) =>
    http
      .get<ApiPlan[]>('/content/plans', { signal })
      .then((plans) => plans.map(toPricingPlan)),
}
