import { http } from '@/service'
import { lessonPath } from '@/config/routes.constants'
import type { GrammarEntry } from '@/features/grammar/types/grammar.types'

/** ---------- What the API actually sends ---------- */

interface ApiGrammarLesson {
  id: string
  slug: string
  title: string
}

interface ApiGrammarRow {
  id: string
  title: string
  cefr: string[]
  order: number
  lessons: ApiGrammarLesson[]
}

/** ---------- Mapping onto the shape the components already use ---------- */

export function toGrammarEntry(dto: ApiGrammarRow): GrammarEntry {
  return {
    id: dto.id,
    point: dto.title,
    level: dto.cefr.join(', '),
    links: dto.lessons.map((lesson) => ({
      label: lesson.title,
      href: lessonPath(lesson.slug),
    })),
  }
}

/** ---------- The public grammar index ---------- */

export const grammarService = {
  /** `cefr` filters server-side, e.g. ['B1','B2'] → ?cefr=B1,B2. */
  list: (cefr: readonly string[] = [], signal?: AbortSignal) =>
    http
      .get<ApiGrammarRow[]>('/content/grammar-index', {
        // An empty string is dropped by the client, so no filter → no param.
        params: { cefr: cefr.join(',') },
        signal,
      })
      .then((rows) => rows.map(toGrammarEntry)),
}
