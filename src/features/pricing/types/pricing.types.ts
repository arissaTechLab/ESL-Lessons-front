export interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  period: string
  billingNote: string
  features: readonly string[]
  ctaLabel: string
  /** Optional ribbon (e.g. "Best value"). */
  badge?: string
  /** Highlighted (beige) card treatment. */
  featured?: boolean
}
