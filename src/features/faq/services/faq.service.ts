import { http } from '@/service'
import type { Faq } from '@/features/faq/types/faq.types'

export const faqService = {
  list: (signal?: AbortSignal) => http.get<Faq[]>('/content/faqs', { signal }),
}
