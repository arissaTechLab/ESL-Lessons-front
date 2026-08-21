import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Placeholder, buttonVariants } from '@/shared/components'
import { lessonPath } from '@/config/routes.constants'
import type { Lesson } from '../types/lesson.types'
import { formatLessonDate } from '../lib/format-lesson-date'
import { LessonLevelBadge } from './LessonLevelBadge'

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
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
export function SeriesIcon({ className = 'size-5' }: { className?: string }) {
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

/**
 * Placeholder for the per-category icon. Real icons are uploaded to /public;
 * swap this for an <img> of the category's icon once they're available.
 */
function CategoryIconPlaceholder() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11.5 11.5 3H20a1 1 0 0 1 1 1v8.5L12.5 21a1.5 1.5 0 0 1-2.1 0l-7.4-7.4a1.5 1.5 0 0 1 0-2.1Z" />
      <circle cx="16" cy="8" r="1.2" />
    </svg>
  )
}

/**
 * The single, data-driven card used for every lesson across the site. Only the
 * `lesson` data changes — the layout is fixed. Every slot reserves a constant
 * height (access row, level bar, 2-line title, date/reference lines) so cards
 * never differ in height, whether or not a lesson has a series icon.
 */
export function LessonCard({
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
    <article className="flex flex-col rounded-xl border border-ink/10 bg-white p-3 shadow-xl">
      {/* Access badge (left) + category / series icons (right). */}
      <div className="mb-2 flex items-center justify-between gap-2">
        {lesson.isFree ? (
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-brand-600">
            <StarIcon />
            Free
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-ink-soft">
            <LockIcon />
            Paid
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1.5">
          {lesson.isSeries && (
            <span
              className="grid size-10 place-items-center rounded-md bg-ink text-white"
              title="Part of a series"
            >
              <SeriesIcon />
            </span>
          )}

          {/* Category icon (white SVG on the black box). */}
          <span
            className="grid size-10 place-items-center rounded-md bg-ink text-white"
            title={lesson.category}
          >
            {lesson.categoryIcon ? (
              <img
                src={encodeURI(lesson.categoryIcon)}
                alt=""
                className="size-6"
              />
            ) : (
              <CategoryIconPlaceholder />
            )}
          </span>
        </div>
      </div>

      {/* 16:9 thumbnail with the category name pill over it (top-right). */}
      <div className="relative">
        {lesson.image ? (
          <img
            src={lesson.image}
            alt=""
            className="aspect-video w-full rounded-t-lg object-cover"
          />
        ) : (
          <Placeholder
            label=""
            className="aspect-video w-full rounded-t-lg rounded-b-none"
          />
        )}

        <span className="absolute right-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
          {lesson.category}
        </span>
      </div>

      {/* Full level bar — joined to the image (flat top, rounded bottom). */}
      <LessonLevelBadge
        level={lesson.level}
        meta={lesson.levelMeta}
        className="rounded-b-lg"
      />

      <h3 className="mt-3 line-clamp-2 min-h-[2.6em] font-heading text-sm font-bold uppercase leading-snug text-ink">
        {lesson.title}
      </h3>

      <div className="mt-3 space-y-0.5 text-xs text-ink-soft">
        <p className="truncate">
          <span className="font-semibold text-ink">Date added:</span>{' '}
          {formatLessonDate(lesson.dateAdded)}
        </p>
        <p className="truncate">
          <span className="font-semibold text-ink">Reference:</span>{' '}
          {lesson.reference ?? '—'}
        </p>
      </div>

      <Link
        to={to ?? lessonPath(lesson.slug)}
        className={buttonVariants('secondary', 'sm', 'mt-4 w-full')}
      >
        Go to lesson
      </Link>

      {footer && <div className="mt-2">{footer}</div>}
    </article>
  )
}
