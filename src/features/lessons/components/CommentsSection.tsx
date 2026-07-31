import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'

interface Comment {
  id: string
  name: string
  time: string
  text: string
}

const COMMENTS: readonly Comment[] = [
  {
    id: 'leonardo',
    name: 'Leonardo Da Vinci',
    time: 'Today',
    text: 'Loved the course. I’ve learned some very subtle tecniques, expecially on leaves.',
  },
  {
    id: 'titania',
    name: 'Titania S',
    time: 'Today',
    text: 'I loved the course, it had been a long time since I had experimented with watercolors and now I will do it more often thanks to Kitani Studio',
  },
  {
    id: 'zhirkov',
    name: 'Zhirkov',
    time: 'Today',
    text: 'Yes. I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. What requires a course to master it. Safe and very didactic teacher.',
  },
]

function Avatar() {
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-200 text-accent-700"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    </span>
  )
}

export function CommentsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <h2 className="font-heading text-lg font-bold text-ink">Comments</h2>
      <p className="mt-2 text-sm text-ink-soft">
        We’d love to hear any thoughts you have on this lesson! Please{' '}
        <Link
          to={APP_ROUTES.LOGIN}
          className="font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Log in
        </Link>{' '}
        and let us know.
      </p>

      <ul className="mt-6 space-y-5">
        {COMMENTS.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <Avatar />
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-accent-700">
                  {comment.name}
                </p>
                <span className="text-xs text-ink-muted">{comment.time}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
