import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES, path } from '@/config/routes.constants'
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
import { adminBlogService } from '@/features/admin-blog/services/admin-blog.service'
import type { AdminArticle } from '@/features/admin-blog/types/admin-blog.types'

const SECTION_LABELS: Record<AdminArticle['section'], string> = {
  'how-to': 'How to',
  'teaching-ideas': 'Teaching Ideas',
}

const HEADER_CELL =
  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted'

function TableSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg bg-accent-100" />
      ))}
    </div>
  )
}

/** Admin blog table: search, publish toggle, edit and delete per article. */
export function AdminBlogPage() {
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [page, setPage] = useState(1)
  // Bumped after every mutation so `useAsync` refetches the table.
  const [version, setVersion] = useState(0)

  // Debounce so the table doesn't refetch on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q.trim()), 300)
    return () => clearTimeout(timer)
  }, [q])

  const [busyId, setBusyId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminArticle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const notify = useToastStore((store) => store.notify)

  const state = useAsync(
    (signal) => adminBlogService.list({ q: debouncedQ, page }, signal),
    [debouncedQ, page, version],
  )

  const handleSearch = (value: string) => {
    setQ(value)
    setPage(1)
  }

  const handleStatus = async (article: AdminArticle, publish: boolean) => {
    setBusyId(article.id)
    try {
      await adminBlogService.setStatus(
        article.id,
        publish ? 'published' : 'draft',
      )
      notify(publish ? 'Article published.' : 'Article moved to drafts.')
      setVersion((current) => current + 1)
    } catch (error) {
      notify(
        error instanceof ApiError
          ? error.message
          : 'Could not update the article.',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return

    setIsDeleting(true)
    try {
      await adminBlogService.remove(pendingDelete.id)
      notify('Article deleted.')
      setPendingDelete(null)
      // Deleting the last row of a trailing page would strand the table on an
      // out-of-range page (the API returns no items there) — step back first.
      if (page > 1 && state.data !== null && state.data.items.length <= 1) {
        setPage(page - 1)
      }
      setVersion((current) => current + 1)
    } catch (error) {
      notify(
        error instanceof ApiError
          ? error.message
          : 'Could not delete the article.',
        'error',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Articles for the How to and Teaching Ideas pages.
          </p>
        </div>
        <Link
          to={APP_ROUTES.ADMIN_BLOG_NEW}
          className={buttonVariants('primary', 'sm')}
        >
          + New article
        </Link>
      </div>

      <SearchInput
        value={q}
        onChange={handleSearch}
        placeholder="Search by title or category…"
        className="mt-6 max-w-sm"
      />

      <div className="mt-4">
        <AsyncSection
          state={state}
          skeleton={<TableSkeleton />}
          isEmpty={(data) => data.items.length === 0}
          empty={
            <p className="rounded-xl border border-ink/10 bg-white py-10 text-center text-sm text-ink-muted">
              {debouncedQ
                ? 'No articles match your search.'
                : 'No articles yet — write the first one.'}
            </p>
          }
        >
          {(data) => (
            <>
              <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
                <table className="w-full min-w-[42rem] text-sm">
                  <thead className="border-b border-ink/10">
                    <tr>
                      <th className={HEADER_CELL}>Title</th>
                      <th className={HEADER_CELL}>Section</th>
                      <th className={HEADER_CELL}>Category</th>
                      <th className={HEADER_CELL}>Status</th>
                      <th className={`${HEADER_CELL} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {data.items.map((article) => (
                      <tr key={article.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">
                            {article.title}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {article.slug}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-ink-soft">
                          {SECTION_LABELS[article.section]}
                        </td>
                        <td className="px-4 py-3 text-ink-soft">
                          {article.category}
                        </td>
                        <td className="px-4 py-3">
                          <StatusSwitch
                            isOn={article.status === 'published'}
                            disabled={busyId === article.id}
                            onChange={(next) =>
                              void handleStatus(article, next)
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-3">
                            <Link
                              to={path(APP_ROUTES.ADMIN_BLOG_EDIT, {
                                id: article.id,
                              })}
                              className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(article)}
                              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={data.page}
                pages={data.pages}
                onChange={setPage}
              />
            </>
          )}
        </AsyncSection>
      </div>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Delete article"
        message={
          <>
            Delete <strong>{pendingDelete?.title}</strong>? This cannot be
            undone.
          </>
        }
        isBusy={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
