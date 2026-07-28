import { useMemo, useState } from 'react'
import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import { LessonCard } from './LessonCard'
import { LessonFilters, type LessonFiltersState } from './LessonFilters'
import { filterLessons } from '../lib/filter-lessons'
import type { Lesson } from '../types/lesson.types'

const DEFAULT_FILTERS: LessonFiltersState = {
  search: '',
  levels: [],
  categories: [],
  topics: [],
  sort: 'recent',
}

interface LessonCollectionPageProps {
  title: string
  subtitle: string
  lessons: readonly Lesson[]
}

/**
 * Shared layout for a single lesson collection (a category or the free
 * lessons). Same header + filters (minus the category filter) + card grid.
 */
export function LessonCollectionPage({
  title,
  subtitle,
  lessons,
}: LessonCollectionPageProps) {
  const [filters, setFilters] = useState<LessonFiltersState>(DEFAULT_FILTERS)

  const update = (patch: Partial<LessonFiltersState>) =>
    setFilters((current) => ({ ...current, ...patch }))
  const clear = () => setFilters(DEFAULT_FILTERS)

  const results = useMemo(
    () => filterLessons(lessons, filters),
    [lessons, filters],
  )

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <LessonFilters
          filters={filters}
          onChange={update}
          onClear={clear}
          showCategoryFilter={false}
        />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm text-ink-muted">
          {results.length} {results.length === 1 ? 'lesson' : 'lessons'}
        </p>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-ink/20 py-16 text-center">
            <p className="text-ink-soft">No lessons match your filters.</p>
            <button
              type="button"
              onClick={clear}
              className="mt-3 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <CtaSection />
    </>
  )
}
