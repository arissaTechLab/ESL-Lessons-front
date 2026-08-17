import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import { LessonGrid } from '@/features/lessons/components/LessonGrid'
import type {
  CatalogueFilterState,
  LessonAccess,
} from '@/features/lessons/types/lesson.types'

interface LessonResultsProps {
  filters: CatalogueFilterState
  page: number
  onPageChange: (page: number) => void
  /** Pin the whole page to free samples (the Free Lessons page). */
  access?: LessonAccess
  /** Pin to one category slug (category pages) — overrides `filters.categories`. */
  category?: string
}

/**
 * The filtered results grid: turns the shared filter state into a `/lessons`
 * query and renders count + tiles + pager. All three catalogue pages reuse it,
 * pinning `access` or `category` where the page itself is the filter.
 */
export function LessonResults({
  filters,
  page,
  onPageChange,
  access,
  category,
}: LessonResultsProps) {
  const categories = category ? [category] : filters.categories

  const state = useAsync(
    (signal) =>
      lessonsService.list(
        {
          q: filters.q.trim() || undefined,
          levels: filters.levels.length > 0 ? filters.levels : undefined,
          categories: categories.length > 0 ? categories : undefined,
          topics: filters.topics.length > 0 ? filters.topics : undefined,
          access,
          sort: filters.sort,
          page,
          limit: 12,
        },
        signal,
      ),
    [
      filters.q,
      filters.levels.join(','),
      categories.join(','),
      filters.topics.join(','),
      filters.sort,
      access ?? '',
      page,
    ],
  )

  return (
    <AsyncSection
      state={state}
      isEmpty={(result) => result.items.length === 0}
      empty={
        <p className="py-10 text-center text-sm text-ink-muted">
          No lessons match your filters yet — try widening the search.
        </p>
      }
    >
      {(result) => <LessonGrid page={result} onPageChange={onPageChange} />}
    </AsyncSection>
  )
}
