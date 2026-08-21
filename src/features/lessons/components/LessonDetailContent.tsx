import type { ReactNode } from 'react'
import { Placeholder } from '@/shared/components'
import { resolveLevelMeta } from '../data/levels'
import { formatLessonDate } from '../lib/format-lesson-date'
import type { LessonDetail } from '../types/lesson.types'
import { LessonLevelBadge } from './LessonLevelBadge'

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-ink/25 px-2.5 py-1 text-xs font-semibold text-ink">
      {children}
    </span>
  )
}

function ResourceLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-ink transition hover:text-brand-600"
    >
      {icon}
      {children}
    </a>
  )
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-ink-soft"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  )
}

interface LessonDetailContentProps {
  lesson: LessonDetail
  /** CTA / action area under the resources (e.g. login or download buttons). */
  actions?: ReactNode
}

/**
 * The shared lesson detail body (overview + description). Reused by the public
 * detail page and the customer's material view — each supplies its own
 * `actions` and page chrome. While a paid lesson is locked for the viewer the
 * API sends `resources: null`, so no resource links render — only `actions`.
 */
export function LessonDetailContent({ lesson, actions }: LessonDetailContentProps) {
  const meta = resolveLevelMeta(lesson.level, lesson.levelMeta)
  const resources = lesson.resources

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h1 className="font-heading text-3xl font-extrabold uppercase leading-tight text-ink sm:text-4xl">
            {lesson.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>{meta.tags.join(' / ')}</Tag>
            <Tag>{lesson.category}</Tag>
            <Tag>{lesson.topic}</Tag>
          </div>

          <p className="mt-4 text-sm text-ink-soft">{lesson.description}</p>

          <div className="mt-5 max-w-xs">
            <LessonLevelBadge level={lesson.level} meta={lesson.levelMeta} />
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-ink">
            <svg
              viewBox="0 0 24 24"
              className="size-4 text-ink-soft"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span className="font-semibold">Uploaded on:</span>{' '}
            {formatLessonDate(lesson.dateAdded)}
          </p>

          {resources && (
            <div className="mt-4 space-y-2">
              {resources.googleSlidesUrl && (
                <ResourceLink
                  href={resources.googleSlidesUrl}
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4 text-amber-500"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 10h6v6H9v-6Z" />
                    </svg>
                  }
                >
                  Google Slides Lesson
                </ResourceLink>
              )}
              {resources.pdfPlanUrl && (
                <ResourceLink
                  href={resources.pdfPlanUrl}
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4 text-rose-500"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 12h2.2a1.6 1.6 0 0 0 0-3.2H7V18Zm0-4.6h1.9a.4.4 0 0 0 0-.8H7v.8Z" />
                    </svg>
                  }
                >
                  Lesson Plan &amp; Method
                </ResourceLink>
              )}
            </div>
          )}

          {actions}
        </div>

        <div>
          {lesson.previewUrl ? (
            <img
              src={lesson.previewUrl}
              alt="Lesson preview"
              className="aspect-[4/3] w-full bg-neutral-200 object-cover"
            />
          ) : (
            <Placeholder
              label="Lesson preview"
              className="aspect-[4/3] w-full bg-neutral-200"
            />
          )}
          {(resources?.videoUrl || resources?.spotifyUrl) && (
            <div className="mt-4 space-y-2">
              {resources.videoUrl && (
                <p className="flex items-center gap-2 text-sm text-ink-soft">
                  <LinkIcon />
                  <span className="font-semibold text-ink">Youtube video:</span>{' '}
                  <a
                    href={resources.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate transition hover:text-brand-600"
                  >
                    {resources.videoUrl}
                  </a>
                </p>
              )}
              {resources.spotifyUrl && (
                <p className="flex items-center gap-2 text-sm text-ink-soft">
                  <LinkIcon />
                  <span className="font-semibold text-ink">Spotify link:</span>{' '}
                  <a
                    href={resources.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate transition hover:text-brand-600"
                  >
                    {resources.spotifyUrl}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {lesson.image ? (
          <img
            src={lesson.image}
            alt="Lesson image"
            className="aspect-[4/3] w-full bg-neutral-200 object-cover"
          />
        ) : (
          <Placeholder
            label="Lesson image"
            className="aspect-[4/3] w-full bg-neutral-200"
          />
        )}
        <div>
          <h2 className="font-heading text-lg font-bold text-ink">
            ESL Lesson Description
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{lesson.summary}</p>

          <h3 className="mt-6 font-heading text-lg font-bold text-ink">
            Objective &amp; Overview
          </h3>
          <p className="mt-2 text-sm text-ink-soft">{lesson.objectives}</p>
        </div>
      </div>
    </div>
  )
}
