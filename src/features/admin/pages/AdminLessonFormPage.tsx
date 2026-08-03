import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AdminPageHeader,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminFileUpload,
  StatusField,
} from '@/features/admin/components'
import {
  CATEGORY_FILTER_OPTIONS,
  LESSON_LEVEL_OPTIONS,
  LESSON_TOPIC_OPTIONS,
  getLessonById,
  type LessonStatus,
} from '@/features/lessons'

const CATEGORY_OPTIONS = CATEGORY_FILTER_OPTIONS.map((c) => ({
  value: c,
  label: c,
}))
const TOPIC_OPTIONS = LESSON_TOPIC_OPTIONS.map((t) => ({ value: t, label: t }))

export function AdminLessonFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = id ? getLessonById(id) : undefined
  const isEdit = Boolean(id)

  const [status, setStatus] = useState<LessonStatus>(
    editing?.status ?? 'draft',
  )

  // Editing an id that doesn't exist → back to the list.
  if (isEdit && !editing) {
    return <Navigate to={APP_ROUTES.ADMIN_LESSONS} replace />
  }

  // Mocked — persisting comes with the backend.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const toast = isEdit
      ? 'Lesson updated.'
      : status === 'published'
        ? 'Lesson published.'
        : 'Lesson saved as draft.'
    navigate(APP_ROUTES.ADMIN_LESSONS, { state: { toast } })
  }

  return (
    <>
      <AdminPageHeader
        title={isEdit ? 'Edit lesson' : 'New lesson'}
        description={
          isEdit
            ? 'Update the material for this lesson.'
            : 'Upload the material for a new lesson.'
        }
        action={
          <Link
            to={APP_ROUTES.ADMIN_LESSONS}
            className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            ← Back to lessons
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
            placeholder="Lesson title"
            defaultValue={editing?.title}
            required
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <AdminSelect
              label="Category"
              name="category"
              placeholder="Select category"
              options={CATEGORY_OPTIONS}
              defaultValue={editing?.category ?? ''}
              required
            />
            <AdminSelect
              label="Level"
              name="level"
              placeholder="Select level"
              options={LESSON_LEVEL_OPTIONS}
              defaultValue={editing?.level ?? ''}
              required
            />
            <AdminSelect
              label="Topic"
              name="topic"
              placeholder="Select topic"
              options={TOPIC_OPTIONS}
              defaultValue={editing?.topic ?? ''}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <AdminInput
              label="Google Slides link"
              name="slidesUrl"
              type="url"
              placeholder="https://…"
            />
            <AdminInput
              label="Video link"
              name="videoUrl"
              type="url"
              placeholder="https://…"
            />
            <AdminInput
              label="Spotify link"
              name="spotifyUrl"
              type="url"
              placeholder="https://…"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <AdminFileUpload
              label="Lesson plan (PDF)"
              accept="application/pdf"
              hint="Click to upload a PDF"
            />
            <AdminFileUpload
              label="Accompanying image"
              accept="image/*"
              hint="Click to upload an image"
            />
          </div>

          <AdminTextarea
            label="Description"
            name="description"
            placeholder="Short description of the lesson"
          />
          <AdminTextarea
            label="Objectives & overview"
            name="objectives"
            placeholder="What the lesson covers, its objectives and overview"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonVariants('primary', 'md')}>
            {isEdit ? 'Update lesson' : 'Save lesson'}
          </button>
          <Link
            to={APP_ROUTES.ADMIN_LESSONS}
            className={buttonVariants('tertiary', 'md')}
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
