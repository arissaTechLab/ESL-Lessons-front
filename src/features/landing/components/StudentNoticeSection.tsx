import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'

/** Slim, discreet notice pointing students to the "For Students" page. */
export function StudentNoticeSection() {
  return (
    <section className="border-y border-ink/10 bg-accent-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-3 text-center text-sm text-ink-soft sm:flex-row sm:gap-3 sm:px-6">
        <svg
          viewBox="0 0 24 24"
          className="size-5 shrink-0 text-brand-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <p>
          <span className="font-semibold text-ink">Are you a student?</span>{' '}
          These lessons are made for tutors to teach.
        </p>
        <Link
          to={APP_ROUTES.FOR_STUDENTS}
          className="font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Here’s how to use them →
        </Link>
      </div>
    </section>
  )
}
