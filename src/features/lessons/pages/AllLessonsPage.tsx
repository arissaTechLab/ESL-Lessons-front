import { useMemo, useState } from 'react'
import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import {
  LessonCard,
  CategoryCard,
  LessonFilters,
  type LessonFiltersState,
} from '@/features/lessons/components'
import {
  LESSONS,
  CATEGORY_OPTIONS,
  TOPIC_OPTIONS,
} from '@/features/lessons/data/lessons'
import { LESSON_CATEGORIES } from '@/features/lessons/data/categories'
import type { Lesson } from '@/features/lessons/types/lesson.types'

const DEFAULT_FILTERS: LessonFiltersState = {
  search: '',
  level: 'all',
  category: 'all',
  topic: 'all',
  sort: 'recent',
}

function sortLessons(lessons: Lesson[], sort: string): Lesson[] {
  const sorted = [...lessons]
  if (sort === 'oldest') {
    sorted.sort((a, b) => a.dateAdded.localeCompare(b.dateAdded))
  } else if (sort === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    // 'recent' — newest first
    sorted.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
  }
  return sorted
}

function SectionHeading({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
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

export function AllLessonsPage() {
  const [filters, setFilters] = useState<LessonFiltersState>(DEFAULT_FILTERS)

  const update = (patch: Partial<LessonFiltersState>) =>
    setFilters((current) => ({ ...current, ...patch }))
  const clear = () => setFilters(DEFAULT_FILTERS)

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.level !== 'all' ||
    filters.category !== 'all' ||
    filters.topic !== 'all'

  const results = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    const matched = LESSONS.filter((lesson) => {
      const matchesLevel =
        filters.level === 'all' || lesson.level === filters.level
      const matchesCategory =
        filters.category === 'all' || lesson.category === filters.category
      const matchesTopic =
        filters.topic === 'all' || lesson.topic === filters.topic
      const matchesQuery =
        query === '' ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.topic.toLowerCase().includes(query) ||
        lesson.category.toLowerCase().includes(query)
      return matchesLevel && matchesCategory && matchesTopic && matchesQuery
    })
    return sortLessons(matched, filters.sort)
  }, [filters])

  const freeLessons = useMemo(
    () => sortLessons(LESSONS.filter((lesson) => lesson.isFree), 'recent').slice(0, 4),
    [],
  )
  const recentLessons = useMemo(
    () => sortLessons([...LESSONS], 'recent').slice(0, 4),
    [],
  )

  return (
    <>
      <PageHeader
        title="Explore the lesson library"
        subtitle="Handcrafted ESL conversation lessons ready to use, designed to spark real speaking practice and save you hours of prep."
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <LessonFilters
          filters={filters}
          onChange={update}
          onClear={clear}
          categories={CATEGORY_OPTIONS}
          topics={TOPIC_OPTIONS}
        />
      </div>

      {hasActiveFilters ? (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            title="Results"
            action={
              <span className="text-sm text-ink-muted">
                {results.length}{' '}
                {results.length === 1 ? 'lesson' : 'lessons'}
              </span>
            }
          />
          {results.length > 0 ? (
            <LessonGrid lessons={results} />
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-ink/20 py-16 text-center">
              <p className="text-ink-soft">
                No lessons match your filters.
              </p>
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
      ) : (
        <>
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <SectionHeading
              title="Free Lessons"
              action={
                <a
                  href="#"
                  className="text-xs font-semibold uppercase tracking-wide text-brand-600 transition hover:text-brand-700"
                >
                  View all free lessons →
                </a>
              }
            />
            <LessonGrid lessons={freeLessons} />
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <SectionHeading title="Most Recent" />
            <LessonGrid lessons={recentLessons} />
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
            <SectionHeading title="All Lessons: Categories" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {LESSON_CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>
        </>
      )}

      <CtaSection />
    </>
  )
}
