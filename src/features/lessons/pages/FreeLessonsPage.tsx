import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import { LessonFilters, LessonResults } from '@/features/lessons/components'
import { useCatalogueFilters } from '@/features/lessons/hooks/useCatalogueFilters'

/** The catalogue pinned to `access=free` — the guide's "Free Lessons" pseudo-topic. */
export function FreeLessonsPage() {
  const { filters, page, setFilters, setPage } = useCatalogueFilters()

  return (
    <>
      <PageHeader
        title="Free Lessons"
        subtitle="Full sample lessons, free forever — try them with your students before subscribing."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LessonFilters value={filters} onChange={setFilters} />

        <div className="mt-10">
          <LessonResults
            filters={filters}
            page={page}
            onPageChange={setPage}
            access="free"
          />
        </div>
      </section>

      <CtaSection />
    </>
  )
}
