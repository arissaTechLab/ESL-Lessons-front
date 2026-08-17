import { useSearchParams } from 'react-router-dom'
import type {
  CatalogueFilterState,
  LessonSort,
} from '@/features/lessons/types/lesson.types'

const SORTS: readonly LessonSort[] = ['newest', 'oldest', 'title-asc']
const DEFAULT_SORT: LessonSort = 'newest'

function parseSort(value: string | null): LessonSort {
  return SORTS.includes(value as LessonSort)
    ? (value as LessonSort)
    : DEFAULT_SORT
}

/**
 * Catalogue filters kept in the URL query string, so a filtered view is
 * shareable and survives a reload. Navigation uses `replace` — typing in the
 * search box must not add one history entry per keystroke.
 */
export function useCatalogueFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: CatalogueFilterState = {
    q: searchParams.get('q') ?? '',
    levels: searchParams.getAll('levels'),
    categories: searchParams.getAll('categories'),
    topics: searchParams.getAll('topics'),
    sort: parseSort(searchParams.get('sort')),
  }

  // Truncate: the API rejects non-integer pages with a 400.
  const page = Math.max(1, Math.trunc(Number(searchParams.get('page'))) || 1)

  /** True once any search text, filter or non-default sort is active. */
  const isFiltering =
    filters.q.trim() !== '' ||
    filters.levels.length > 0 ||
    filters.categories.length > 0 ||
    filters.topics.length > 0 ||
    filters.sort !== DEFAULT_SORT

  const setFilters = (next: CatalogueFilterState) => {
    const params = new URLSearchParams()
    if (next.q) params.set('q', next.q)
    for (const level of next.levels) params.append('levels', level)
    for (const category of next.categories) params.append('categories', category)
    for (const topic of next.topics) params.append('topics', topic)
    if (next.sort !== DEFAULT_SORT) params.set('sort', next.sort)
    // No `page` on purpose: changing a filter jumps back to the first page.
    setSearchParams(params, { replace: true })
  }

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams)
    if (next <= 1) params.delete('page')
    else params.set('page', String(next))
    setSearchParams(params, { replace: true })
  }

  return { filters, page, isFiltering, setFilters, setPage }
}
