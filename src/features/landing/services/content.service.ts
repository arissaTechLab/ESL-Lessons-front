import { http } from '@/service'
import type { Stat, Testimonial } from '@/features/landing/types/content.types'

/** Editable marketing content shown on the landing page. */
export const contentService = {
  stats: (signal?: AbortSignal) => http.get<Stat[]>('/content/stats', { signal }),

  testimonials: (signal?: AbortSignal) =>
    http.get<Testimonial[]>('/content/testimonials', { signal }),

  subscribeToNewsletter: (email: string) =>
    http.post<void>('/newsletter/subscribe', { email }),
}
