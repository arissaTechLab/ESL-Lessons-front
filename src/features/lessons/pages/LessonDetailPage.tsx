import { Link, useParams } from 'react-router-dom'
import { AsyncSection, buttonVariants } from '@/shared/components'
import { useAsync } from '@/hooks'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  LessonCard,
  LessonDetailContent,
  CommentsSection,
  NewsletterSection,
} from '@/features/lessons/components'
import { lessonsService } from '@/features/lessons/services/lessons.service'

export function LessonDetailPage() {
  const { slug = '' } = useParams()

  const lessonState = useAsync(
    (signal) => lessonsService.bySlug(slug, signal),
    [slug],
  )
  const similarState = useAsync(
    (signal) => lessonsService.similar(slug, signal),
    [slug],
  )

  // A 404 (or any failure) replaces the whole page with one friendly notice —
  // the API's message for an unknown slug is "Lesson not found".
  if (lessonState.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p
          role="status"
          className="rounded-xl border border-ink/10 bg-cream px-4 py-6 text-center text-sm text-ink-soft"
        >
          {lessonState.error}
        </p>
      </div>
    )
  }

  return (
    <AsyncSection
      state={lessonState}
      skeleton={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div
            className="h-96 animate-pulse rounded-xl border border-ink/10 bg-accent-100"
            aria-hidden="true"
          />
        </div>
      }
    >
      {(lesson) => (
        <>
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            {/* While the lesson is locked the API sends `resources: null`,
                so only the login CTA renders — never empty links. */}
            <LessonDetailContent
              lesson={lesson}
              actions={
                <Link
                  to={APP_ROUTES.LOGIN}
                  className={buttonVariants('primary', 'md', 'mt-6')}
                >
                  Log in to get lesson
                </Link>
              }
            />
          </div>

          {/* Similar lessons */}
          <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-ink sm:text-3xl">
              Similar Lessons
            </h2>
            <AsyncSection state={similarState} skeleton={<></>} empty={<></>}>
              {(similar) => (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {similar.map((item) => (
                    <LessonCard key={item.id} lesson={item} />
                  ))}
                </div>
              )}
            </AsyncSection>
          </section>

          <CommentsSection slug={slug} />
          <NewsletterSection />
        </>
      )}
    </AsyncSection>
  )
}
