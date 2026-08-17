import { useState } from 'react'
import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { LessonCard } from '@/features/lessons/components/LessonCard'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import type { LessonCard as Lesson } from '@/features/lessons/types/lesson.types'

interface LessonsSectionProps {
  /** Section heading. */
  title?: string
  subtitle?: string
  /** How many lessons to pull. */
  limit?: number
  /** Restrict to free samples — used by the "Free Lessons" block. */
  freeOnly?: boolean
}

/**
 * Grid of lessons pulled live from the API. Every tile is the shared
 * {@link LessonCard}, so the public library, category pages and the client's
 * Materials screen all stay visually identical.
 */
export function LessonsSection({
  title = 'Browse lessons',
  subtitle = 'Ready-to-teach conversation lessons — filter by level, category or topic.',
  limit = 8,
  freeOnly = false,
}: LessonsSectionProps) {
  const [search, setSearch] = useState('')

  const state = useAsync(
    (signal) =>
      lessonsService.list(
        { limit, q: search || undefined, access: freeOnly ? 'free' : undefined },
        signal,
      ),
    [limit, search, freeOnly],
  )

  return (
    <section id="lessons" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
        </div>

        <label className="min-w-64">
          <span className="sr-only">Search lessons</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search lessons…"
            className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>
      </div>

      <div className="mt-10">
        <AsyncSection
          state={state}
          isEmpty={(page) => page.items.length === 0}
          empty={
            <p className="py-10 text-center text-sm text-ink-muted">
              No lessons match your search yet.
            </p>
          }
        >
          {(page) => (
            <>
              <p className="mb-4 text-sm text-ink-muted">
                {page.total} {page.total === 1 ? 'lesson' : 'lessons'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {page.items.map((lesson: Lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </>
          )}
        </AsyncSection>
      </div>
    </section>
  )
}
