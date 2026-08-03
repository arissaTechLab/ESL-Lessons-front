import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES, adminLessonEditPath } from '@/config/routes.constants'
import {
  AdminPageHeader,
  ConfirmModal,
  Toast,
  StatusToggle,
  AdminRowActions,
} from '@/features/admin/components'
import { useNavigationToast } from '@/features/admin/hooks/useNavigationToast'
import {
  LESSONS,
  LessonLevelBadge,
  formatLessonDate,
  type Lesson,
} from '@/features/lessons'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

export function AdminLessonsPage() {
  const toast = useNavigationToast()
  const [lessons, setLessons] = useState<Lesson[]>([...LESSONS])
  const [pendingDelete, setPendingDelete] = useState<Lesson | null>(null)

  const toggleStatus = (id: string) =>
    setLessons((current) =>
      current.map((lesson) =>
        lesson.id === id
          ? {
              ...lesson,
              status: lesson.status === 'published' ? 'draft' : 'published',
            }
          : lesson,
      ),
    )

  const confirmDelete = () => {
    if (pendingDelete) {
      setLessons((current) =>
        current.filter((lesson) => lesson.id !== pendingDelete.id),
      )
    }
    setPendingDelete(null)
  }

  return (
    <>
      <AdminPageHeader
        title="Lessons"
        description="The lessons currently in the library. Upload a new one to add to it."
        action={
          <Link
            to={APP_ROUTES.ADMIN_LESSON_NEW}
            className={buttonVariants('primary', 'sm')}
          >
            + New lesson
          </Link>
        }
      />

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-cream/60 text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className={TH}>Title</th>
                <th className={TH}>Category</th>
                <th className={TH}>Level</th>
                <th className={TH}>Topic</th>
                <th className={TH}>Access</th>
                <th className={TH}>Status</th>
                <th className={TH}>Date added</th>
                <th className={`${TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {lesson.title}
                  </td>
                  <td className={TD}>{lesson.category}</td>
                  <td className="px-4 py-3">
                    <LessonLevelBadge level={lesson.level} compact />
                  </td>
                  <td className={TD}>{lesson.topic}</td>
                  <td className="px-4 py-3">
                    {lesson.isFree ? (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                        Free
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                        Paid
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusToggle
                      status={lesson.status}
                      onToggle={() => toggleStatus(lesson.id)}
                    />
                  </td>
                  <td className={TD}>{formatLessonDate(lesson.dateAdded)}</td>
                  <td className="px-4 py-3">
                    <AdminRowActions
                      editTo={adminLessonEditPath(lesson.id)}
                      onDelete={() => setPendingDelete(lesson)}
                      label={lesson.title}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete lesson"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong className="text-ink">{pendingDelete?.title}</strong>? This
            action can’t be undone.
          </>
        }
        confirmLabel="Delete lesson"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {toast && <Toast message={toast} />}
    </>
  )
}
