/** A headline figure in the Stats band — `icon` is an SVG path `d` attribute. */
export interface Stat {
  id: string
  value: string
  label: string
  icon: string
  order: number
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  avatarUrl: string | null
  order: number
}
