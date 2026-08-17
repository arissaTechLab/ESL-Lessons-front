import { http } from '@/service'
import type { Plan } from '@/features/pricing/types/pricing.types'

export const pricingService = {
  list: (signal?: AbortSignal) => http.get<Plan[]>('/content/plans', { signal }),
}
