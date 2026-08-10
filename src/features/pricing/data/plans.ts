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

/** The two real subscription plans — edit prices and advantages here. */
export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: 'six-months',
    name: 'The Semester Pass',
    description: 'Full access for 6 months, then a simple monthly rate.',
    price: '$72',
    period: '/ first 6 months',
    billingNote: 'Billed once as $72 for the first 6 months, then $12/month.',
    features: [
      'Full access to the entire lesson library',
      '3–5 new lessons added every month',
      'Google Slides & teacher guides included',
      'Auto-renews — cancel anytime in Account settings',
    ],
    ctaLabel: 'Subscribe now',
  },
  {
    id: 'one-year',
    name: 'The Annual Pass',
    description: 'Best value — a full year of ready-to-teach lessons.',
    price: '$112',
    period: '/ year',
    billingNote:
      'Billed once as $112 for the first year, then billed annually.',
    badge: 'Best value',
    featured: true,
    features: [
      'Everything in the Semester Pass',
      'Full access to the entire lesson library',
      '3–5 new lessons added every month',
      'Auto-renews yearly — cancel anytime in Account settings',
    ],
    ctaLabel: 'Subscribe now',
  },
]
