import { Link, useParams } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  LessonCard,
  LessonDetailContent,
  CommentsSection,
  NewsletterSection,
} from '@/features/lessons/components'
import { LESSONS, getLessonById } from '@/features/lessons/data/lessons'
import type { Lesson } from '@/features/lessons/types/lesson.types'

/** Shown when the id isn't a known lesson (e.g. placeholder cards). */
const FALLBACK_LESSON: Lesson = {
  id: 'lesson',
  title: 'Lesson title goes here with 2 rows',
  level: 'intermediate-upper-intermediate',
  category: 'Grammar',
  topic: 'Health',
  dateAdded: '2025-04-14',
  isFree: false,
  isSeries: false,
  status: 'published',
}

export function LessonDetailPage() {
  const { slug } = useParams()
  const lesson = getLessonById(slug ?? '') ?? FALLBACK_LESSON
  const similar = LESSONS.filter((item) => item.id !== lesson.id).slice(0, 4)

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((item) => (
            <LessonCard key={item.id} lesson={item} />
          ))}
        </div>
      </section>

      <CommentsSection />
      <NewsletterSection />
    </>
  )
}
