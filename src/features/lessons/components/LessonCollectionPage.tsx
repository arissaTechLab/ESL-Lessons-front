import { useState } from 'react'
import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import type { LessonFilters as LessonQuery } from '../types/lesson.types'
import { LessonCard } from './LessonCard'
import {
  LessonFilters,
  toLessonQuery,
  type LessonFiltersState,
} from './LessonFilters'

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
  /** Fixed part of the catalogue query (e.g. the category or `access=free`). */
  query: LessonQuery
}

/**
 * Shared layout for a single lesson collection (a category or the free
 * lessons). Same header + filters (minus the category filter) + card grid.
 * Filtering happens server-side: the bar's state merges into `query`.
 */
export function LessonCollectionPage({
  title,
  subtitle,
  query,
}: LessonCollectionPageProps) {
  const [filters, setFilters] = useState<LessonFiltersState>(DEFAULT_FILTERS)

  const update = (patch: Partial<LessonFiltersState>) =>
    setFilters((current) => ({ ...current, ...patch }))
  const clear = () => setFilters(DEFAULT_FILTERS)

  const state = useAsync(
    (signal) => lessonsService.list({ ...toLessonQuery(filters), ...query }, signal),
    [
      filters.search,
      filters.levels.join(','),
      filters.topics.join(','),
      filters.sort,
      JSON.stringify(query),
    ],
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
        {state.data && (
          <p className="text-sm text-ink-muted">
            {state.data.total} {state.data.total === 1 ? 'lesson' : 'lessons'}
          </p>
        )}

        <AsyncSection
          state={state}
          isEmpty={(page) => page.items.length === 0}
          empty={
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
          }
        >
          {(page) => (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.items.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </AsyncSection>
      </section>

      <CtaSection />
    </>
  )
}
