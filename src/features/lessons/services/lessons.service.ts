import { http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  CuratedLessons,
  LessonCard,
  LessonDetail,
  LessonFilters,
} from '@/features/lessons/types/lesson.types'

/** Public lesson catalogue. Only published lessons are ever returned. */
export const lessonsService = {
  list: (filters: LessonFilters = {}, signal?: AbortSignal) =>
    http.get<Paginated<LessonCard>>('/lessons', {
      params: { ...filters },
      signal,
    }),

  /** Free + most recent + category cards, for the unfiltered All Lessons view. */
  curated: (signal?: AbortSignal) =>
    http.get<CuratedLessons>('/lessons/curated', { signal }),

  bySlug: (slug: string, signal?: AbortSignal) =>
    http.get<LessonDetail>(`/lessons/${slug}`, { signal }),

  similar: (slug: string, signal?: AbortSignal) =>
    http.get<LessonCard[]>(`/lessons/${slug}/similar`, { signal }),
}
