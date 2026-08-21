import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { APP_ROUTES } from '@/config/routes.constants'
import { CtaSection } from '@/features/landing'
import {
  LessonCard,
  CategoryCard,
  LessonFilters,
  toLessonQuery,
  type LessonFiltersState,
} from '@/features/lessons/components'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import type { Lesson } from '@/features/lessons/types/lesson.types'

const DEFAULT_FILTERS: LessonFiltersState = {
  search: '',
  levels: [],
  categories: [],
  topics: [],
  sort: 'recent',
}

function SectionHeading({
  title,
  action,
  inlineAction = false,
}: {
  title: string
  action?: React.ReactNode
  /** Place the action right next to the title instead of the far right. */
  inlineAction?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        inlineAction ? 'flex-wrap' : 'justify-between'
      }`}
    >
      <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
        {title}
      </h2>
      {action}
    </div>
  )
}

function LessonGrid({ lessons }: { lessons: readonly Lesson[] }) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  )
}

/** Skeleton matching the curated grids, inside the page container. */
function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-xl border border-ink/10 bg-accent-100"
          />
        ))}
      </div>
    </div>
  )
}

export function AllLessonsPage() {
  const [filters, setFilters] = useState<LessonFiltersState>(DEFAULT_FILTERS)

  const update = (patch: Partial<LessonFiltersState>) =>
    setFilters((current) => ({ ...current, ...patch }))
  const clear = () => setFilters(DEFAULT_FILTERS)

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.levels.length > 0 ||
    filters.categories.length > 0 ||
    filters.topics.length > 0

  // Filtering happens server-side: the bar's state becomes the catalogue query.
  const results = useAsync(
    (signal) => lessonsService.list(toLessonQuery(filters), signal),
    [
      filters.search,
      filters.levels.join(','),
      filters.categories.join(','),
      filters.topics.join(','),
      filters.sort,
    ],
  )

  // The curated payload carries the lesson rows and per-category counts; the
  // taxonomy list carries the tile art (image, icon, levels range).
  const curated = useAsync(async (signal) => {
    const [sections, categories] = await Promise.all([
      lessonsService.curated(signal),
      lessonsService.categories(signal),
    ])
    return {
      freeLessons: sections.freeLessons,
      mostRecent: sections.mostRecent,
      categories: categories.map((tile) => ({
        ...tile,
        lessonCount:
          sections.categories.find((c) => c.slug === tile.slug)?.lessonCount ??
          tile.lessonCount,
      })),
    }
  }, [])

  return (
    <>
      <PageHeader
        title="Explore the lesson library"
        subtitle={
          <>
            1-on-1 ESL materials unlike anything else on the internet.
            <br />
            Knock their socks off - without the prep time.
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <LessonFilters filters={filters} onChange={update} onClear={clear} />
      </div>

      {hasActiveFilters ? (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            title="Results"
            action={
              results.data && (
                <span className="text-sm text-ink-muted">
                  {results.data.total}{' '}
                  {results.data.total === 1 ? 'lesson' : 'lessons'}
                </span>
              )
            }
          />
          <AsyncSection
            state={results}
            isEmpty={(page) => page.items.length === 0}
            empty={
              <div className="mt-8 rounded-xl border border-dashed border-ink/20 py-16 text-center">
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
            {(page) => <LessonGrid lessons={page.items} />}
          </AsyncSection>
        </section>
      ) : (
        <AsyncSection state={curated} skeleton={<SectionSkeleton />}>
          {(data) => (
            <>
              <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <SectionHeading
                  title="Free Lessons"
                  inlineAction
                  action={
                    <Link
                      to={APP_ROUTES.FREE_LESSONS}
                      className="text-xs font-semibold uppercase tracking-wide text-brand-600 transition hover:text-brand-700"
                    >
                      View all free lessons →
                    </Link>
                  }
                />
                <LessonGrid lessons={data.freeLessons} />
              </section>

              <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
                <SectionHeading title="Most Recent" />
                <LessonGrid lessons={data.mostRecent} />
              </section>

              <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                <SectionHeading title="All Lessons: Categories" />
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {data.categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </section>
            </>
          )}
        </AsyncSection>
      )}

      <CtaSection />
    </>
  )
}
