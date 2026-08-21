import { http } from '@/service'
import type { Faq } from '@/features/faq/types/faq.types'

/** ---------- What the API actually sends ---------- */

interface ApiFaq {
  id: string
  question: string
  answer: string
  order: number
}

/** ---------- The public FAQ list ---------- */

export const faqService = {
  list: (signal?: AbortSignal) =>
    http.get<ApiFaq[]>('/content/faqs', { signal }).then((faqs) =>
      [...faqs]
        .sort((a, b) => a.order - b.order)
        .map(
          ({ id, question, answer }): Faq => ({ id, question, answer }),
        ),
    ),
}
