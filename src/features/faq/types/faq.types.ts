/** A single accordion entry on the FAQ page, managed by the admin. */
export interface Faq {
  id: string
  question: string
  answer: string
  order: number
}
