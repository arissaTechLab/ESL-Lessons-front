export interface PricingPlan {
  id: string
  name: string
  description: string
  /** Placeholder price — change later. */
  price: string
  period: string
  billingNote: string
  /** Placeholder advantages — change later. */
  features: readonly string[]
  ctaLabel: string
  /** Optional ribbon (e.g. "Best value"). */
  badge?: string
  /** Highlighted (beige) card treatment. */
  featured?: boolean
}

/**
 * The two real subscription plans. Prices and advantages are placeholders for
 * now — swap them here and both cards update.
 */
export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: 'six-months',
    name: '6-Month Plan',
    description: 'Full access to the entire lesson library for six months.',
    price: '$59',
    period: '/ 6 months',
    billingNote: 'Billed once as $59 for six months.',
    features: [
      'Unlock every lesson in the library',
      '3–5 new lessons added every month',
      'Google Slides & Teacher Guides included',
      'Cancel anytime',
    ],
    ctaLabel: 'Subscribe now',
  },
  {
    id: 'one-year',
    name: '12-Month Plan',
    description: 'Best value — a full year of ready-to-teach lessons.',
    price: '$99',
    period: '/ year',
    billingNote: 'Billed once as $99 for the year.',
    badge: 'Best value',
    featured: true,
    features: [
      'Everything in the 6-Month Plan',
      'Two extra months free vs. paying monthly',
      'Priority access to new lesson series',
      'Cancel anytime',
    ],
    ctaLabel: 'Subscribe now',
  },
]
