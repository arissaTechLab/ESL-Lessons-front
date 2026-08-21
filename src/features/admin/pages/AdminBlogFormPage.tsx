import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '@/hooks'
import { AsyncSection, buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AdminPageHeader,
  AdminInput,
  AdminTextarea,
  AdminFileUpload,
  StatusField,
} from '@/features/admin/components'
import type { BlogStatus } from '@/features/blog'
import {
  adminReportsService,
  type AdminArticle,
} from '@/features/admin/services/admin-reports.service'

function BlogForm({ editing }: { editing: AdminArticle | null }) {
  const navigate = useNavigate()
  const isEdit = editing !== null

  const [status, setStatus] = useState<BlogStatus>(editing?.status ?? 'draft')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return

    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    const content = String(form.get('text') ?? '').trim()
    const image = form.get('image')

    setIsSaving(true)
    setError(null)
    try {
      let imageUrl: string | undefined
      if (image instanceof File && image.size > 0) {
        imageUrl = (await adminReportsService.uploadImage(image)).url
      }

      const input = { title, content, status, imageUrl }
      if (isEdit) {
        await adminReportsService.updateArticle(editing.id, input)
      } else {
        await adminReportsService.createArticle(input)
      }

      const toast = isEdit
        ? 'Post updated.'
        : status === 'published'
          ? 'Post published.'
          : 'Post saved as draft.'
      navigate(APP_ROUTES.ADMIN_BLOG, { state: { toast } })
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Something went wrong. Please try again.',
      )
      setIsSaving(false)
    }
  }

  return (
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
          defaultValue={editing?.content}
          required
        />

        <AdminFileUpload
          label="Image"
          name="image"
          accept="image/*"
          hint="Click to upload an image"
          initialFileName={editing?.imageUrl?.split('/').pop() ?? null}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className={buttonVariants('primary', 'md')}
        >
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
  )
}

export function AdminBlogFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const state = useAsync(
    (signal) =>
      id ? adminReportsService.article(id, signal) : Promise.resolve(null),
    [id],
  )

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

      {isEdit ? (
        <AsyncSection state={state} isEmpty={() => false}>
          {(editing) => <BlogForm editing={editing} />}
        </AsyncSection>
      ) : (
        <BlogForm editing={null} />
      )}
    </>
  )
}
