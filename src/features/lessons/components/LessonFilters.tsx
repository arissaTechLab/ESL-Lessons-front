import { MultiSelectDropdown, SortDropdown } from '@/shared/components'
import { useAsync } from '@/hooks'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import type { LessonFilters as LessonQuery } from '../types/lesson.types'
import { CEFR_LEVELS, FREE_LESSONS_TOPIC } from '../data/filters'
import { SeriesIcon } from './LessonCard'

export interface LessonFiltersState {
  search: string
  levels: string[]
  categories: string[]
  topics: string[]
  sort: string
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Sort by Release Date' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
] as const

/** UI sort values → the API's sort keys. */
const SORT_TO_API: Record<string, LessonQuery['sort']> = {
  recent: 'newest',
  oldest: 'oldest',
  title: 'title-asc',
}

/**
 * Translate the filter bar's state into the catalogue query. The "Free
 * Lessons" pseudo-topic becomes `access=free` — it is not a real topic.
 */
export function toLessonQuery(filters: LessonFiltersState): LessonQuery {
  const topics = filters.topics.filter((topic) => topic !== FREE_LESSONS_TOPIC)
  return {
    q: filters.search.trim() || undefined,
    levels: filters.levels.length > 0 ? filters.levels : undefined,
    categories: filters.categories.length > 0 ? filters.categories : undefined,
    topics: topics.length > 0 ? topics : undefined,
    access: filters.topics.includes(FREE_LESSONS_TOPIC) ? 'free' : undefined,
    sort: SORT_TO_API[filters.sort] ?? 'newest',
  }
}

interface LessonFiltersProps {
  filters: LessonFiltersState
  onChange: (patch: Partial<LessonFiltersState>) => void
  onClear: () => void
  /** Hide the categories dropdown (e.g. on a single-category page). */
  showCategoryFilter?: boolean
}

export function LessonFilters({
  filters,
  onChange,
  onClear,
  showCategoryFilter = true,
}: LessonFiltersProps) {
  // Category/topic options come from the managed taxonomy so newly added
  // ones show up in the public filters too. Values are slugs — what the
  // catalogue endpoint filters on.
  const taxonomy = useAsync((signal) => lessonsService.taxonomy(signal))
  const categoryOptions = (taxonomy.data?.categories ?? []).map((c) => ({
    value: c.slug,
    label: c.name,
  }))
  const topicOptions = [
    { value: FREE_LESSONS_TOPIC, label: FREE_LESSONS_TOPIC },
    ...(taxonomy.data?.topics ?? []).map((t) => ({
      value: t.slug,
      label: t.name,
    })),
  ]

  return (
    <div>
      {/* Search + series hint */}
      <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <svg
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search grammar or lesson topic"
            aria-label="Search lessons"
            className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none"
          />
        </div>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <SeriesIcon className="size-4 text-ink-soft" />
          Spot this icon? It means the lesson is part of a series!
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3 border-y border-ink/10 py-4">
        <MultiSelectDropdown
          label="Lesson level"
          title="CEFR Levels"
          options={CEFR_LEVELS}
          selected={filters.levels}
          onApply={(values) => onChange({ levels: values })}
        />
        {showCategoryFilter && (
          <MultiSelectDropdown
            label="Lesson categories"
            options={categoryOptions}
            selected={filters.categories}
            onApply={(values) => onChange({ categories: values })}
          />
        )}
        <MultiSelectDropdown
          label="Lesson topic"
          options={topicOptions}
          selected={filters.topics}
          onApply={(values) => onChange({ topics: values })}
        />
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Clear all filters
        </button>

        <div className="sm:ml-auto">
          <SortDropdown
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={(value) => onChange({ sort: value })}
          />
        </div>
      </div>
    </div>
  )
}
