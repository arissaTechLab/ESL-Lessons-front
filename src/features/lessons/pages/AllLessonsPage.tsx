import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import {
  CategoryCards,
  LessonCardGrid,
  LessonFilters,
  LessonResults,
} from '@/features/lessons/components'
import { useCatalogueFilters } from '@/features/lessons/hooks/useCatalogueFilters'

/** "Free Lessons" + "Most Recent" + category tiles, shown until a filter is used. */
function CuratedView() {
  const state = useAsync((signal) => lessonsService.curated(signal), [])

  return (
    <AsyncSection
      state={state}
      isEmpty={(curated) =>
        curated.freeLessons.length === 0 &&
        curated.mostRecent.length === 0 &&
        curated.categories.length === 0
      }
    >
      {(curated) => (
        <div className="space-y-14">
          <section aria-labelledby="free-lessons-title">
            <h2
              id="free-lessons-title"
              className="font-heading text-2xl font-bold text-ink"
            >
              Free Lessons
            </h2>
            <div className="mt-6">
              <LessonCardGrid lessons={curated.freeLessons} />
            </div>
          </section>

          <section aria-labelledby="most-recent-title">
            <h2
              id="most-recent-title"
              className="font-heading text-2xl font-bold text-ink"
            >
              Most Recent
            </h2>
            <div className="mt-6">
              <LessonCardGrid lessons={curated.mostRecent} />
            </div>
          </section>

          <section aria-labelledby="all-categories-title">
            <h2
              id="all-categories-title"
              className="font-heading text-2xl font-bold text-ink"
            >
              All Lessons: Categories
            </h2>
            <div className="mt-6">
              <CategoryCards categories={curated.categories} />
            </div>
          </section>
        </div>
      )}
    </AsyncSection>
  )
}

/**
 * The public catalogue. Unfiltered it shows the curated sections; the moment
 * any search text, filter or sort is set it switches to the results grid.
 */
export function AllLessonsPage() {
  const { filters, page, isFiltering, setFilters, setPage } =
    useCatalogueFilters()

  return (
    <>
      <PageHeader
        title="All Lessons"
        subtitle="Browse the full library of ready-to-teach ESL conversation lessons — search or filter by level, category and topic."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LessonFilters value={filters} onChange={setFilters} />

        <div className="mt-10">
          {isFiltering ? (
            <LessonResults
              filters={filters}
              page={page}
              onPageChange={setPage}
            />
          ) : (
            <CuratedView />
          )}
        </div>
      </section>
    </>
  )
}
