import { Link } from 'react-router-dom'
import { APP_ROUTES, path } from '@/config/routes.constants'
import type { CuratedLessons } from '@/features/lessons/types/lesson.types'

interface CategoryCardsProps {
  categories: CuratedLessons['categories']
}

/** The "All Lessons: Categories" tiles on the unfiltered catalogue view. */
export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={path(APP_ROUTES.CATEGORY, { slug: category.slug })}
          className="group flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream px-5 py-4 transition hover:border-brand-500 hover:shadow-md"
        >
          <div>
            <h3 className="font-heading text-sm font-semibold text-ink transition group-hover:text-brand-600">
              {category.name}
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              {category.lessonCount}{' '}
              {category.lessonCount === 1 ? 'lesson' : 'lessons'}
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 text-ink-muted transition group-hover:translate-x-1 group-hover:text-brand-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      ))}
    </div>
  )
}
