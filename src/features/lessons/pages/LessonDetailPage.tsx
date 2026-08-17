import { Link, useParams } from 'react-router-dom'
import { AsyncSection, Placeholder, buttonVariants } from '@/shared/components'
import { useAsync } from '@/hooks'
import { APP_ROUTES, path } from '@/config/routes.constants'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import {
  LessonCardGrid,
  LessonComments,
  NewsletterBand,
} from '@/features/lessons/components'
import type {
  LessonDetail,
  LessonResources,
} from '@/features/lessons/types/lesson.types'

function formatDate(value: string | null): string {
  if (!value) return 'Unpublished'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** The rows of the resources card — only non-null links render. */
const RESOURCE_ROWS: { key: keyof LessonResources; label: string }[] = [
  { key: 'googleSlidesUrl', label: 'Open the Google Slides' },
  { key: 'pdfPlanUrl', label: 'Download the PDF lesson plan' },
  { key: 'videoUrl', label: 'Watch the lesson video' },
  { key: 'spotifyUrl', label: 'Listen on Spotify' },
]

function LockNotice() {
  return (
    <div className="rounded-xl border border-ink/10 bg-cream p-6 text-center">
      <svg
        viewBox="0 0 24 24"
        className="mx-auto size-8 text-ink-muted"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" />
      </svg>
      <h3 className="mt-3 font-heading text-lg font-semibold text-ink">
        This is a paid lesson
      </h3>
      <p className="mt-2 text-sm text-ink-soft">
        Subscribers get the slides, the PDF plan and every other lesson in the
        library.
      </p>
      <Link
        to={APP_ROUTES.LOGIN}
        className={buttonVariants('primary', 'md', 'mt-5 w-full')}
      >
        Log in to get this lesson
      </Link>
    </div>
  )
}

function ResourcesCard({ resources }: { resources: LessonResources }) {
  const rows = RESOURCE_ROWS.filter((row) => resources[row.key])

  return (
    <div className="rounded-xl border border-ink/10 bg-cream p-6">
      <h3 className="font-heading text-lg font-semibold text-ink">
        Lesson resources
      </h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">
          No downloadable resources for this lesson yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((row) => (
            <li key={row.key}>
              <a
                href={resources[row.key] ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6H5V6h6m3-3h7v7m0-7L10 14" />
                </svg>
                {row.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DetailBody({ lesson }: { lesson: LessonDetail }) {
  const previewSrc = lesson.previewUrl ?? lesson.imageUrl

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Badge row: access, level (data-driven colour), category, topic, series. */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            lesson.access === 'free'
              ? 'bg-accent-200 text-accent-800'
              : 'bg-ink/10 text-ink-soft'
          }`}
        >
          {lesson.access === 'free' ? 'Free lesson' : 'Paid lesson'}
        </span>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: lesson.level.color,
            color: lesson.level.textColor,
          }}
        >
          {lesson.level.name} ({lesson.level.cefr.join('/')})
        </span>
        <Link
          to={path(APP_ROUTES.CATEGORY, { slug: lesson.category.slug })}
          className="inline-flex items-center rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink-soft transition hover:border-brand-500 hover:text-brand-600"
        >
          {lesson.category.name}
        </Link>
        <span className="inline-flex items-center rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink-soft">
          {lesson.topic.name}
        </span>
        {lesson.series && (
          <span className="text-xs font-medium text-ink-muted">
            Part {lesson.series.order} of “{lesson.series.name}”
          </span>
        )}
      </div>

      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {lesson.title}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Published {formatDate(lesson.publishedAt)}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt={`Preview of “${lesson.title}”`}
              className="aspect-video w-full rounded-2xl object-cover"
            />
          ) : (
            <Placeholder label="Lesson preview" className="aspect-video w-full" />
          )}

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              About this lesson
            </h2>
            <p className="mt-3 whitespace-pre-line text-ink-soft">
              {lesson.description}
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              Objectives
            </h2>
            <p className="mt-3 whitespace-pre-line text-ink-soft">
              {lesson.objectives}
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              Lesson summary
            </h2>
            <p className="mt-3 whitespace-pre-line text-ink-soft">
              {lesson.summary}
            </p>
          </div>
        </div>

        <aside aria-label="Lesson resources">
          {lesson.isLocked || !lesson.resources ? (
            <LockNotice />
          ) : (
            <ResourcesCard resources={lesson.resources} />
          )}
        </aside>
      </div>
    </section>
  )
}

function SimilarLessons({ slug }: { slug: string }) {
  const state = useAsync((signal) => lessonsService.similar(slug, signal), [slug])

  return (
    <section
      aria-labelledby="similar-lessons-title"
      className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"
    >
      <h2
        id="similar-lessons-title"
        className="font-heading text-2xl font-bold text-ink"
      >
        Similar lessons
      </h2>
      <div className="mt-6">
        <AsyncSection
          state={state}
          empty={
            <p className="py-6 text-sm text-ink-muted">
              No similar lessons yet.
            </p>
          }
        >
          {(lessons) => <LessonCardGrid lessons={lessons} />}
        </AsyncSection>
      </div>
    </section>
  )
}

function DetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6"
      aria-hidden="true"
    >
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-accent-100" />
      <div className="h-64 animate-pulse rounded-2xl bg-accent-100" />
      <div className="h-32 animate-pulse rounded-2xl bg-accent-100" />
    </div>
  )
}

/** Public lesson detail: content, gated resources, similar, comments, newsletter. */
export function LessonDetailPage() {
  const { slug = '' } = useParams()
  const state = useAsync((signal) => lessonsService.bySlug(slug, signal), [slug])

  // The guide asks for a friendly 404 here, so this page owns its error state.
  if (state.error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Lesson not found
        </h1>
        <p className="mt-3 text-ink-soft">
          This lesson may have been unpublished, or the link is wrong.
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
    <AsyncSection state={state} skeleton={<DetailSkeleton />}>
      {(lesson) => (
        <>
          <DetailBody lesson={lesson} />
          <SimilarLessons slug={lesson.slug} />
          <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
            <LessonComments slug={lesson.slug} />
          </section>
          <NewsletterBand />
        </>
      )}
    </AsyncSection>
  )
}
