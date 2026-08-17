import { Placeholder } from '@/shared/components'
import type { LessonCard as Lesson } from '@/features/lessons/types/lesson.types'

interface LessonCardProps {
  lesson: Lesson
  /** Opens the lesson detail. */
  onOpen?: (lesson: Lesson) => void
}

function formatDate(value: string | null): string {
  if (!value) return 'Unpublished'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Free/Paid pill — a star for samples, a padlock for the paid library. */
function AccessBadge({ access }: { access: Lesson['access'] }) {
  const isFree = access === 'free'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isFree ? 'bg-accent-200 text-accent-800' : 'bg-ink/10 text-ink-soft'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        {isFree ? (
          <path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18l.9-5.5-4-3.9L9.5 8 12 3Z" />
        ) : (
          <path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" />
        )}
      </svg>
      {isFree ? 'Free' : 'Paid'}
    </span>
  )
}

/**
 * The lesson "tile" used across the public library, the category pages, the
 * free-lessons page and the client's Materials screen. Fixed height so grids
 * stay aligned regardless of title length.
 */
export function LessonCard({ lesson, onOpen }: LessonCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-ink/10 bg-cream p-3 transition hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <AccessBadge access={lesson.access} />

        {lesson.series && (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted"
            title={`Part of the "${lesson.series.name}" series`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Series
          </span>
        )}
      </div>

      {lesson.imageUrl ? (
        <img
          src={lesson.imageUrl}
          alt=""
          loading="lazy"
          className="mt-3 aspect-[16/10] w-full rounded-lg object-cover"
        />
      ) : (
        <Placeholder label="Photo" className="mt-3 aspect-[16/10] w-full rounded-lg" />
      )}

      <h3 className="mt-3 font-heading text-sm font-semibold leading-snug text-ink">
        {lesson.title}
      </h3>

      {/* The level band carries its own colour, managed from admin Taxonomy. */}
      <div
        className="mt-3 rounded-md px-2.5 py-1.5 text-xs font-semibold"
        style={{
          backgroundColor: lesson.level.color,
          color: lesson.level.textColor,
        }}
      >
        {lesson.level.name}
        <span className="ml-1 font-normal opacity-80">
          ({lesson.level.cefr.join('/')})
        </span>
      </div>

      <dl className="mt-3 flex-1 space-y-1 text-xs text-ink-soft">
        <div className="flex gap-1">
          <dt className="font-medium text-ink">Category:</dt>
          <dd>{lesson.category.name}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium text-ink">Topic:</dt>
          <dd>{lesson.topic.name}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium text-ink">Date:</dt>
          <dd>{formatDate(lesson.publishedAt)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => onOpen?.(lesson)}
        className="mt-4 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Go to lesson
      </button>
    </article>
  )
}
