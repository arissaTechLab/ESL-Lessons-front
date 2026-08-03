import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AdminPageHeader,
  AdminInput,
  AdminTextarea,
  AdminFileUpload,
  StatusField,
} from '@/features/admin/components'
import { getPostById, type BlogStatus } from '@/features/blog'

export function AdminBlogFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = id ? getPostById(id) : undefined
  const isEdit = Boolean(id)

  const [status, setStatus] = useState<BlogStatus>(editing?.status ?? 'draft')

  if (isEdit && !editing) {
    return <Navigate to={APP_ROUTES.ADMIN_BLOG} replace />
  }

  // Mocked — persisting comes with the backend.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const toast = isEdit
      ? 'Post updated.'
      : status === 'published'
        ? 'Post published.'
        : 'Post saved as draft.'
    navigate(APP_ROUTES.ADMIN_BLOG, { state: { toast } })
  }

  return (
    <>
      <AdminPageHeader
        title={isEdit ? 'Edit post' : 'New post'}
        description={
          isEdit
            ? 'Update this blog post.'
            : 'Write a new teaching-idea / blog post.'
        }
        action={
          <Link
            to={APP_ROUTES.ADMIN_BLOG}
            className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            ← Back to blog
          </Link>
        }
      />

      <form
        key={editing?.id ?? 'new'}
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6"
      >
        <div className="space-y-5 rounded-xl border border-ink/10 bg-white/60 p-6">
          <StatusField value={status} onChange={setStatus} />

          <AdminInput
            label="Title"
            name="title"
            placeholder="Post title"
            defaultValue={editing?.title}
            required
          />

          <AdminTextarea
            label="Text"
            name="text"
            placeholder="Write the post content…"
            defaultValue={editing?.text}
            required
          />

          <AdminFileUpload
            label="Image"
            accept="image/*"
            hint="Click to upload an image"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonVariants('primary', 'md')}>
            {isEdit ? 'Update post' : 'Save post'}
          </button>
          <Link
            to={APP_ROUTES.ADMIN_BLOG}
            className={buttonVariants('tertiary', 'md')}
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
