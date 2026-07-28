import { Placeholder, buttonVariants } from '@/shared/components'
import type { Lesson } from '../types/lesson.types'
import { formatLessonDate } from '../data/lessons'
import { LessonLevelBadge } from './LessonLevelBadge'

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.1 21l1.1-6.5L2.5 9.8l6.5-.9L12 3Z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

/** "Part of a series" marker — see the note in the filters bar. */
export function SeriesIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  )
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <article className="flex flex-col rounded-xl border border-ink/10 bg-cream p-3">
      {/* Access badge + series marker */}
      <div className="mb-2 flex items-center justify-between">
        {lesson.isFree ? (
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-brand-600">
            <StarIcon />
            Free
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-ink-soft">
            <LockIcon />
            {lesson.credits} credit
          </span>
        )}
        {lesson.isSeries && (
          <span
            className="grid size-7 place-items-center rounded-full border border-ink/20 text-ink-soft"
            title="Part of a series"
          >
            <SeriesIcon />
          </span>
        )}
      </div>

      <Placeholder label="" className="aspect-[4/3] w-full rounded-lg" />

      <h3 className="mt-3 line-clamp-2 min-h-[2.6em] font-heading text-sm font-bold uppercase leading-snug text-ink">
        {lesson.title}
      </h3>

      <div className="mt-2">
        <LessonLevelBadge level={lesson.level} />
      </div>

      <div className="mt-3 space-y-0.5 text-xs text-ink-soft">
        <p>
          <span className="font-semibold text-ink">Category:</span>{' '}
          {lesson.category}
        </p>
        <p>
          <span className="font-semibold text-ink">Topic:</span> {lesson.topic}
        </p>
        <p>
          <span className="font-semibold text-ink">Date added:</span>{' '}
          {formatLessonDate(lesson.dateAdded)}
        </p>
      </div>

      <a
        href="#"
        className={buttonVariants('secondary', 'sm', 'mt-4 w-full')}
      >
        Go to lesson
      </a>
    </article>
  )
}
