import { useNavigate } from 'react-router-dom'
import { Pagination } from '@/shared/components'
import { APP_ROUTES, path } from '@/config/routes.constants'
import { LessonCard } from '@/features/lessons/components/LessonCard'
import type { LessonCard as Lesson } from '@/features/lessons/types/lesson.types'
import type { Paginated } from '@/interface'

/** Plain tile grid — curated rows and "Similar lessons" reuse it un-paginated. */
export function LessonCardGrid({ lessons }: { lessons: Lesson[] }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onOpen={({ slug }) =>
            navigate(path(APP_ROUTES.LESSON_DETAIL, { slug }))
          }
        />
      ))}
    </div>
  )
}

interface LessonGridProps {
  page: Paginated<Lesson>
  onPageChange: (page: number) => void
}

/** Result grid with its count and pager, shared by every catalogue page. */
export function LessonGrid({ page, onPageChange }: LessonGridProps) {
  return (
    <div>
      <p role="status" className="mb-4 text-sm text-ink-muted">
        {page.total} {page.total === 1 ? 'lesson' : 'lessons'}
      </p>
      <LessonCardGrid lessons={page.items} />
      <Pagination page={page.page} pages={page.pages} onChange={onPageChange} />
    </div>
  )
}
