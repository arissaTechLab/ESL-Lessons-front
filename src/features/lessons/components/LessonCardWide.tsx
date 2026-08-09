import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Placeholder, buttonVariants } from '@/shared/components'
import { lessonPath } from '@/config/routes.constants'
import type { Lesson } from '../types/lesson.types'
import { formatLessonDate } from '../data/lessons'
import { LessonLevelBadge } from './LessonLevelBadge'
import { SeriesIcon } from './LessonCard'

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.1 21l1.1-6.5L2.5 9.8l6.5-.9L12 3Z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

/**
 * Alternate lesson card — a wider 16:9 layout with the access badge, series
 * marker and category overlaid on the thumbnail. Same data as `LessonCard`;
 * kept as a separate component so both designs can coexist.
 */
export function LessonCardWide({
  lesson,
  to,
  footer,
}: {
  lesson: Lesson
  /** Destination for the card's link (defaults to the public detail page). */
  to?: string
  /** Optional extra content rendered below the button (e.g. a folder picker). */
  footer?: ReactNode
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl">
      {/* 16:9 thumbnail with everything overlaid on it. */}
      <div className="relative">
        <Placeholder
          label=""
          className="aspect-video w-full rounded-none border-0"
        />

        {/* Access badge — top-left */}
        {lesson.isFree ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-600 shadow-sm backdrop-blur-sm">
            <StarIcon />
            Free
          </span>
        ) : (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft shadow-sm backdrop-blur-sm">
            <LockIcon />
            Paid
          </span>
        )}

        {/* Series marker — top-right */}
        {lesson.isSeries && (
          <span
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-ink-soft shadow-sm backdrop-blur-sm"
            title="Part of a series"
          >
            <SeriesIcon />
          </span>
        )}

        {/* Category — bottom-left, highlighted */}
        <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
          {lesson.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.6em] font-heading text-sm font-bold uppercase leading-snug text-ink">
          {lesson.title}
        </h3>

        <div className="mt-2">
          <LessonLevelBadge level={lesson.level} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-ink-soft">
          <span className="truncate">
            <span className="font-semibold text-ink">Topic:</span>{' '}
            {lesson.topic}
          </span>
          <span className="shrink-0">{formatLessonDate(lesson.dateAdded)}</span>
        </div>

        <Link
          to={to ?? lessonPath(lesson.id)}
          className={buttonVariants('secondary', 'sm', 'mt-4 w-full')}
        >
          Go to lesson
        </Link>

        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </article>
  )
}
