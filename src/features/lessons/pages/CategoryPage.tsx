import { Link, useParams } from 'react-router-dom'
import { PageHeader, buttonVariants } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import { APP_ROUTES } from '@/config/routes.constants'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import { LessonFilters, LessonResults } from '@/features/lessons/components'
import { useCatalogueFilters } from '@/features/lessons/hooks/useCatalogueFilters'

/** Readable fallback while taxonomy loads (`story-based-units` → "Story Based Units"). */
function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** One category's lessons, with the shared filters minus the category select. */
export function CategoryPage() {
  const { slug = '' } = useParams()
  const { filters, page, setFilters, setPage } = useCatalogueFilters()

  // Resolves the display name; the list itself only needs the slug.
  const taxonomy = useAsync((signal) => lessonsService.taxonomy(signal), [])
  const category = taxonomy.data?.categories.find(
    (entry) => entry.slug === slug,
  )

  // Taxonomy resolved but the slug matches nothing — a friendly dead end.
  if (taxonomy.data && !category) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Category not found
        </h1>
        <p className="mt-3 text-ink-soft">
          This category does not exist or is no longer available.
        </p>
        <Link
          to={APP_ROUTES.LESSONS}
          className={buttonVariants('primary', 'md', 'mt-8')}
        >
          Browse all lessons
        </Link>
      </section>
    )
  }

  return (
    <>
      <PageHeader
        title={category?.name ?? titleFromSlug(slug)}
        subtitle="Every published lesson in this category — filter by level or topic to narrow it down."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LessonFilters value={filters} onChange={setFilters} hideCategory />

        <div className="mt-10">
          <LessonResults
            filters={filters}
            page={page}
            onPageChange={setPage}
            category={slug}
          />
        </div>
      </section>

      <CtaSection />
    </>
  )
}
