import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES, adminBlogEditPath } from '@/config/routes.constants'
import {
  AdminPageHeader,
  ConfirmModal,
  Toast,
  StatusToggle,
  AdminRowActions,
} from '@/features/admin/components'
import { useNavigationToast } from '@/features/admin/hooks/useNavigationToast'
import { BLOG_POSTS, formatPostDate, type BlogPost } from '@/features/blog'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

export function AdminBlogPage() {
  const toast = useNavigationToast()
  const [posts, setPosts] = useState<BlogPost[]>([...BLOG_POSTS])
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null)

  const toggleStatus = (id: string) =>
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              status: post.status === 'published' ? 'draft' : 'published',
            }
          : post,
      ),
    )

  const confirmDelete = () => {
    if (pendingDelete) {
      setPosts((current) =>
        current.filter((post) => post.id !== pendingDelete.id),
      )
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
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                >
                  <td className="max-w-md px-4 py-3">
                    <p className="truncate font-medium text-ink">{post.title}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {post.text}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusToggle
                      status={post.status}
                      onToggle={() => toggleStatus(post.id)}
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
