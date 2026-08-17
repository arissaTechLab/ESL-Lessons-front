export type PlanKey = '6-months' | '12-months'

/** A subscription plan as returned by `GET /content/plans`. */
export interface Plan {
  id: string
  key: PlanKey
  name: string
  price: number
  currency: string
  durationMonths: number
  features: string[]
  isFeatured: boolean
  order: number
}
