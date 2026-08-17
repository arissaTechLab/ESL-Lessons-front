import { http } from '@/service'
import type { GrammarPoint } from '@/features/grammar/types/grammar.types'

export const grammarService = {
  /** The contract expects CSV (`?cefr=B1,B2`); no param means every level. */
  list: (cefr?: string[], signal?: AbortSignal) =>
    http.get<GrammarPoint[]>('/content/grammar-index', {
      params: { cefr: cefr && cefr.length > 0 ? cefr.join(',') : undefined },
      signal,
    }),
}
