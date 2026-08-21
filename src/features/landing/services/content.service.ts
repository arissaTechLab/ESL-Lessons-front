import { http } from '@/service'

/** ---------- What the API actually sends ---------- */

interface ApiStat {
  id: string
  value: string
  label: string
  /** SVG path `d` values that make up the icon. */
  icon: string[]
  order: number
}

interface ApiTestimonial {
  id: string
  quote: string
  name: string
  role: string
  avatarUrl: string | null
  order: number
}

/** ---------- The shapes the landing sections already use ---------- */

export interface Stat {
  id: string
  value: string
  label: string
  /** One or more SVG path `d` values that make up the icon. */
  icon: readonly string[]
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  /** Profile photo — falls back to an avatar placeholder when absent. */
  photo?: string
  /** LinkedIn profile URL — '#' until real links are supplied by the API. */
  linkedin: string
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

const toStat = (dto: ApiStat): Stat => ({
  id: dto.id,
  value: dto.value,
  label: dto.label,
  icon: dto.icon,
})

const toTestimonial = (dto: ApiTestimonial): Testimonial => ({
  id: dto.id,
  quote: dto.quote,
  name: dto.name,
  role: dto.role,
  photo: dto.avatarUrl ?? undefined,
  linkedin: '#',
})

/** ---------- Editable landing-page content ---------- */

export const contentService = {
  stats: (signal?: AbortSignal) =>
    http
      .get<ApiStat[]>('/content/stats', { signal })
      .then((items) => [...items].sort(byOrder).map(toStat)),

  testimonials: (signal?: AbortSignal) =>
    http
      .get<ApiTestimonial[]>('/content/testimonials', { signal })
      .then((items) => [...items].sort(byOrder).map(toTestimonial)),

  subscribe: (email: string) =>
    http.post<{ id: string; email: string }>('/newsletter/subscribe', { email }),
}
