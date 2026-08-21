import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAsync } from '@/hooks'
import { AsyncSection, buttonVariants } from '@/shared/components'
import { APP_ROUTES, adminBlogEditPath } from '@/config/routes.constants'
import {
  AdminPageHeader,
  ConfirmModal,
  Toast,
  StatusToggle,
  AdminRowActions,
} from '@/features/admin/components'
import { useNavigationToast } from '@/features/admin/hooks/useNavigationToast'
import { formatPostDate } from '@/features/blog'
import {
  adminReportsService,
  type AdminArticle,
} from '@/features/admin/services/admin-reports.service'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

type ArticleStatus = AdminArticle['status']

export function AdminBlogPage() {
  const toast = useNavigationToast()

  const [page, setPage] = useState(1)
  // Bumped after a mutation to refetch the current page.
  const [version, setVersion] = useState(0)

  const [pendingDelete, setPendingDelete] = useState<AdminArticle | null>(null)
  // Optimistic status flips, so a toggle doesn't reload the whole table.
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, ArticleStatus>
  >({})

  const state = useAsync(
    (signal) => adminReportsService.articles({ page }, signal),
    [page, version],
  )

  const refresh = () => {
    setStatusOverrides({})
    setVersion((v) => v + 1)
  }

  const toggleStatus = (post: AdminArticle) => {
    const current = statusOverrides[post.id] ?? post.status
    const next: ArticleStatus = current === 'published' ? 'draft' : 'published'
    setStatusOverrides((overrides) => ({ ...overrides, [post.id]: next }))
    adminReportsService.setArticleStatus(post.id, next).catch(() => refresh())
  }

  const confirmDelete = () => {
    if (pendingDelete) {
      adminReportsService
        .deleteArticle(pendingDelete.id)
        .then(refresh)
        .catch(refresh)
    }
    setPendingDelete(null)
  }

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Create and manage teaching-idea / blog posts."
        action={
          <Link
            to={APP_ROUTES.ADMIN_BLOG_NEW}
            className={buttonVariants('primary', 'sm')}
          >
            + New post
          </Link>
        }
      />

      <AsyncSection state={state} isEmpty={(data) => data.items.length === 0}>
        {(data) => (
          <>
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-ink/10 bg-cream/60 text-xs uppercase tracking-wide text-ink-muted">
                    <tr>
                      <th className={TH}>Title</th>
                      <th className={TH}>Status</th>
                      <th className={TH}>Date</th>
                      <th className={`${TH} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                      >
                        <td className="max-w-md px-4 py-3">
                          <p className="truncate font-medium text-ink">
                            {post.title}
                          </p>
                          <p className="truncate text-xs text-ink-muted">
                            {post.excerpt}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusToggle
                            status={statusOverrides[post.id] ?? post.status}
                            onToggle={() => toggleStatus(post)}
                          />
                        </td>
                        <td className={TD}>{formatPostDate(post.date)}</td>
                        <td className="px-4 py-3">
                          <AdminRowActions
                            editTo={adminBlogEditPath(post.id)}
                            onDelete={() => setPendingDelete(post)}
                            label={post.title}
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
        title="Delete post"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong className="text-ink">{pendingDelete?.title}</strong>? This
            action can’t be undone.
          </>
        }
        confirmLabel="Delete post"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {toast && <Toast message={toast} />}
    </>
  )
}
