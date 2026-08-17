import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AsyncSection,
  ConfirmDialog,
  Pagination,
  SearchInput,
  StatusSwitch,
  buttonVariants,
} from '@/shared/components'
import { useAsync } from '@/hooks'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import { APP_ROUTES, path } from '@/config/routes.constants'
import { LevelBadge } from '@/features/admin-taxonomy'
import { adminLessonsService } from '@/features/admin-lessons/services/admin-lessons.service'
import type {
  AdminLesson,
  LessonStatus,
} from '@/features/admin-lessons/types/admin-lesson.types'

const PAGE_SIZE = 10

type StatusFilter = LessonStatus | ''

function AccessPill({ access }: { access: AdminLesson['access'] }) {
  const isFree = access === 'free'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isFree ? 'bg-accent-200 text-accent-800' : 'bg-ink/10 text-ink-soft'
      }`}
    >
      {isFree ? 'Free' : 'Paid'}
    </span>
  )
}

/** Admin lesson table: search, status filter, inline publish switch, edit/delete. */
export function AdminLessonsPage() {
  const notify = useToastStore((state) => state.notify)

  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)

  // Debounce so the table doesn't refetch on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q.trim()), 300)
    return () => clearTimeout(timer)
  }, [q])

  const state = useAsync(
    (signal) =>
      adminLessonsService.list(
        {
          q: debouncedQ || undefined,
          status: statusFilter || undefined,
          page,
          limit: PAGE_SIZE,
        },
        signal,
      ),
    [debouncedQ, statusFilter, page, reloadKey],
  )

  // Status flips are applied over the fetched rows so the table doesn't
  // flash a skeleton for a single toggle.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, LessonStatus>>({})
  const [flippingId, setFlippingId] = useState<string | null>(null)

  const { data } = state

  // Every fresh response is authoritative: drop the optimistic overlays, and
  // step back a page when a delete emptied the current one (the API answers
  // out-of-range pages with an empty `items` and the real `pages` count).
  // Guarded render-time adjustment — same pattern as `useAsync`.
  const [seenData, setSeenData] = useState(data)
  if (seenData !== data) {
    setSeenData(data)
    setStatusOverrides({})
    if (data && data.items.length === 0 && data.page > 1) {
      setPage(Math.max(1, Math.min(data.page - 1, data.pages)))
    }
  }

  const [pendingDelete, setPendingDelete] = useState<AdminLesson | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const refresh = () => setReloadKey((key) => key + 1)

  const handleSearch = (value: string) => {
    setQ(value)
    setPage(1)
  }

  const handleStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleStatusFlip = async (lesson: AdminLesson, publish: boolean) => {
    const next: LessonStatus = publish ? 'published' : 'draft'
    setFlippingId(lesson.id)
    try {
      await adminLessonsService.setStatus(lesson.id, next)
      notify(
        next === 'published'
          ? `"${lesson.title}" published.`
          : `"${lesson.title}" moved to draft.`,
      )
      if (statusFilter) {
        // The row no longer matches the active filter — refetch drops it.
        refresh()
      } else {
        setStatusOverrides((current) => ({ ...current, [lesson.id]: next }))
      }
    } catch (error) {
      notify(
        error instanceof ApiError ? error.message : 'Could not update the status.',
        'error',
      )
    } finally {
      setFlippingId(null)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await adminLessonsService.remove(pendingDelete.id)
      notify(`"${pendingDelete.title}" deleted.`)
      setPendingDelete(null)
      refresh()
    } catch (error) {
      notify(
        error instanceof ApiError ? error.message : 'Could not delete the lesson.',
        'error',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <header>
        <h1 className="font-heading text-3xl font-extrabold text-ink">Lessons</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Create, publish and organise the lesson library. Drafts are only visible here.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={q}
          onChange={handleSearch}
          placeholder="Search lessons…"
          className="sm:w-72"
        />

        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => handleStatusFilter(event.target.value as StatusFilter)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition focus:border-brand-500 focus:outline-none sm:w-auto"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <Link
          to={APP_ROUTES.ADMIN_LESSON_NEW}
          className={buttonVariants('primary', 'sm', 'sm:ml-auto')}
        >
          + New lesson
        </Link>
      </div>

      <div className="mt-6">
        <AsyncSection
          state={state}
          skeleton={
            <div className="h-96 animate-pulse rounded-xl bg-accent-100" aria-hidden="true" />
          }
          isEmpty={(data) => data.items.length === 0}
          empty={
            <p className="rounded-xl border border-ink/10 bg-white py-10 text-center text-sm text-ink-muted">
              No lessons match your filters.
            </p>
          }
        >
          {(data) => (
            <>
              <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">Topic</th>
                      <th className="px-4 py-3">Access</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {data.items.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="max-w-64 px-4 py-3 font-medium text-ink">
                          {lesson.title}
                        </td>
                        <td className="px-4 py-3 text-ink-soft">{lesson.category.name}</td>
                        <td className="px-4 py-3">
                          <LevelBadge level={lesson.level} />
                        </td>
                        <td className="px-4 py-3 text-ink-soft">{lesson.topic.name}</td>
                        <td className="px-4 py-3">
                          <AccessPill access={lesson.access} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusSwitch
                            isOn={
                              (statusOverrides[lesson.id] ?? lesson.status) ===
                              'published'
                            }
                            disabled={flippingId === lesson.id}
                            onChange={(next) => handleStatusFlip(lesson, next)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Link
                              to={path(APP_ROUTES.ADMIN_LESSON_EDIT, { id: lesson.id })}
                              aria-label={`Edit "${lesson.title}"`}
                              className="rounded-lg p-1.5 text-ink-muted transition hover:bg-ink/5 hover:text-brand-600"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Link>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(lesson)}
                              aria-label={`Delete "${lesson.title}"`}
                              className="rounded-lg p-1.5 text-ink-muted transition hover:bg-red-50 hover:text-red-600"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <path d="M10 11v6M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination page={data.page} pages={data.pages} onChange={setPage} />
            </>
          )}
        </AsyncSection>
      </div>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Delete lesson"
        confirmLabel="Delete"
        isBusy={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        message={
          <>
            Delete <strong>{pendingDelete?.title}</strong>? This removes the lesson for
            every client and cannot be undone.
          </>
        }
      />
    </div>
  )
}
