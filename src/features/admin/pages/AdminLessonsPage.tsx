import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAsync } from '@/hooks'
import { AsyncSection, buttonVariants } from '@/shared/components'
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
  LessonLevelBadge,
  formatLessonDate,
  type Lesson,
  type LessonStatus,
} from '@/features/lessons'
import { adminService } from '@/features/admin/services/admin.service'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

const CONTROL =
  'rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

export function AdminLessonsPage() {
  const toast = useNavigationToast()

  // Server-side query: search (debounced), status filter and page.
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'' | LessonStatus>('')
  const [page, setPage] = useState(1)
  // Bumped after a mutation to refetch the current page.
  const [version, setVersion] = useState(0)

  const [pendingDelete, setPendingDelete] = useState<Lesson | null>(null)
  // Optimistic status flips, so a toggle doesn't reload the whole table.
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, LessonStatus>
  >({})

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const state = useAsync(
    (signal) =>
      adminService.lessons(
        { q: q || undefined, status: status || undefined, page },
        signal,
      ),
    [q, status, page, version],
  )

  const refresh = () => {
    setStatusOverrides({})
    setVersion((v) => v + 1)
  }

  const toggleStatus = (lesson: Lesson) => {
    const current = statusOverrides[lesson.id] ?? lesson.status
    const next: LessonStatus = current === 'published' ? 'draft' : 'published'
    setStatusOverrides((overrides) => ({ ...overrides, [lesson.id]: next }))
    adminService
      .setLessonStatus(lesson.id, next)
      .then(() => {
        // With a status filter active the row no longer belongs on this page.
        if (status) refresh()
      })
      .catch(() => refresh())
  }

  const confirmDelete = () => {
    if (pendingDelete) {
      adminService
        .deleteLesson(pendingDelete.id)
        .then(refresh)
        .catch(refresh)
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

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lessons…"
          aria-label="Search lessons"
          className={`${CONTROL} w-full max-w-xs`}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as '' | LessonStatus)
            setPage(1)
          }}
          aria-label="Filter by status"
          className={CONTROL}
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <AsyncSection state={state} isEmpty={(data) => data.items.length === 0}>
        {(data) => (
          <>
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
                    {data.items.map((lesson) => (
                      <tr
                        key={lesson.id}
                        className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                      >
                        <td className="px-4 py-3 font-medium text-ink">
                          {lesson.title}
                        </td>
                        <td className={TD}>{lesson.category}</td>
                        <td className="px-4 py-3">
                          <LessonLevelBadge
                            level={lesson.level}
                            meta={lesson.levelMeta}
                            compact
                          />
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
                            status={statusOverrides[lesson.id] ?? lesson.status}
                            onToggle={() => toggleStatus(lesson)}
                          />
                        </td>
                        <td className={TD}>
                          {formatLessonDate(lesson.dateAdded)}
                        </td>
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

            {data.pages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-ink-soft">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.page <= 1}
                  className="rounded-lg border border-ink/20 px-3 py-1.5 font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span>
                  Page {data.page} of {data.pages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                  disabled={data.page >= data.pages}
                  className="rounded-lg border border-ink/20 px-3 py-1.5 font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </AsyncSection>

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
