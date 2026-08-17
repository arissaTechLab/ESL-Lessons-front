import { Link, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { ArticleForm } from '@/features/admin-blog/components/ArticleForm'
import { adminBlogService } from '@/features/admin-blog/services/admin-blog.service'

function FormSkeleton() {
  return (
    <div className="mt-6 max-w-3xl space-y-4" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-accent-100" />
      ))}
    </div>
  )
}

/** Loads the article first — hooks can't be called conditionally in the page. */
function EditForm({ id }: { id: string }) {
  const state = useAsync((signal) => adminBlogService.byId(id, signal), [id])

  return (
    <AsyncSection
      state={state}
      skeleton={<FormSkeleton />}
      isEmpty={() => false}
    >
      {(article) => <ArticleForm article={article} />}
    </AsyncSection>
  )
}

/** One component serves both /admin/blog/new and /admin/blog/:id/edit. */
export function AdminBlogFormPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <>
      <Link
        to={APP_ROUTES.ADMIN_BLOG}
        className="text-sm font-semibold text-ink-muted transition hover:text-ink"
      >
        &larr; Back to blog
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-bold text-ink">
        {id ? 'Edit article' : 'New article'}
      </h1>

      {id ? <EditForm id={id} /> : <ArticleForm />}
    </>
  )
}
