import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '@/service'
import { useAsync } from '@/hooks'
import { AsyncSection, buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AdminPageHeader,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminFileUpload,
  StatusField,
  Toast,
} from '@/features/admin/components'
import type { LessonStatus } from '@/features/lessons'
import {
  adminService,
  type AdminLesson,
  type AdminLessonDto,
  type AdminTaxonomy,
} from '@/features/admin/services/admin.service'

/** `/uploads/plan-abc.pdf` → `plan-abc.pdf`, shown in the upload boxes. */
const fileNameFromUrl = (url: string | null): string | null =>
  url ? (url.split('/').pop() ?? null) : null

/** Trimmed string form field (file inputs are read separately). */
const readField = (form: FormData, name: string): string => {
  const value = form.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

function LessonForm({
  taxonomy,
  editing,
}: {
  taxonomy: AdminTaxonomy
  editing: AdminLesson | null
}) {
  const navigate = useNavigate()
  const isEdit = editing !== null

  // Options come from the managed taxonomy (admin → Taxonomy).
  const categoryOptions = taxonomy.categories.map((c) => ({
    value: c.id,
    label: c.name,
  }))
  const topicOptions = taxonomy.topics.map((t) => ({
    value: t.id,
    label: t.name,
  }))
  const levelOptions = taxonomy.levels.map((l) => ({
    value: l.id,
    label: l.name,
  }))

  const [status, setStatus] = useState<LessonStatus>(
    editing?.status ?? 'draft',
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)

    const form = new FormData(event.currentTarget)

    try {
      // Files first: the lesson body wants the uploaded URLs.
      let pdfPlanUrl = editing?.pdfPlanUrl ?? null
      const pdfFile = form.get('pdfPlan')
      if (pdfFile instanceof File && pdfFile.size > 0) {
        pdfPlanUrl = (await adminService.upload(pdfFile, 'pdf')).url
      }

      let imageUrl = editing?.imageUrl ?? null
      const imageFile = form.get('image')
      if (imageFile instanceof File && imageFile.size > 0) {
        imageUrl = (await adminService.upload(imageFile, 'image')).url
      }

      const dto: AdminLessonDto = {
        title: readField(form, 'title'),
        category: readField(form, 'category'),
        level: readField(form, 'level'),
        topic: readField(form, 'topic'),
        status,
        reference: readField(form, 'reference') || null,
        description: readField(form, 'description'),
        objectives: readField(form, 'objectives'),
        googleSlidesUrl: readField(form, 'slidesUrl') || null,
        videoUrl: readField(form, 'videoUrl') || null,
        spotifyUrl: readField(form, 'spotifyUrl') || null,
        pdfPlanUrl,
        imageUrl,
      }

      if (editing) {
        await adminService.updateLesson(editing.id, dto)
      } else {
        await adminService.createLesson(dto)
      }

      const toast = isEdit
        ? 'Lesson updated.'
        : status === 'published'
          ? 'Lesson published.'
          : 'Lesson saved as draft.'
      navigate(APP_ROUTES.ADMIN_LESSONS, { state: { toast } })
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Could not save the lesson.',
      )
      setSaving(false)
    }
  }

  return (
    <>
      <form
        key={editing?.id ?? 'new'}
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6"
      >
        <div className="space-y-5 rounded-xl border border-ink/10 bg-white/60 p-6">
          <StatusField value={status} onChange={setStatus} />

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <AdminInput
                label="Title"
                name="title"
                placeholder="Lesson title"
                defaultValue={editing?.title}
                required
              />
            </div>
            <AdminInput
              label="Reference"
              name="reference"
              placeholder="e.g. POD.01"
              defaultValue={editing?.reference ?? undefined}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <AdminSelect
              label="Category"
              name="category"
              placeholder="Select category"
              options={categoryOptions}
              defaultValue={editing?.category.id ?? ''}
              required
            />
            <AdminSelect
              label="Level"
              name="level"
              placeholder="Select level"
              options={levelOptions}
              defaultValue={editing?.level.id ?? ''}
              required
            />
            <AdminSelect
              label="Topic"
              name="topic"
              placeholder="Select topic"
              options={topicOptions}
              defaultValue={editing?.topic.id ?? ''}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <AdminInput
              label="Google Slides link"
              name="slidesUrl"
              type="url"
              placeholder="https://…"
              defaultValue={editing?.googleSlidesUrl ?? undefined}
            />
            <AdminInput
              label="Video link"
              name="videoUrl"
              type="url"
              placeholder="https://…"
              defaultValue={editing?.videoUrl ?? undefined}
            />
            <AdminInput
              label="Spotify link"
              name="spotifyUrl"
              type="url"
              placeholder="https://…"
              defaultValue={editing?.spotifyUrl ?? undefined}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <AdminFileUpload
              label="Lesson plan (PDF)"
              name="pdfPlan"
              accept="application/pdf"
              hint="Click to upload a PDF"
              initialFileName={fileNameFromUrl(editing?.pdfPlanUrl ?? null)}
            />
            <AdminFileUpload
              label="Accompanying image"
              name="image"
              accept="image/*"
              hint="Click to upload an image"
              initialFileName={fileNameFromUrl(editing?.imageUrl ?? null)}
            />
          </div>

          <AdminTextarea
            label="Description"
            name="description"
            placeholder="Short description of the lesson"
            defaultValue={editing?.description}
          />
          <AdminTextarea
            label="Objectives & overview"
            name="objectives"
            placeholder="What the lesson covers, its objectives and overview"
            defaultValue={editing?.objectives}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className={buttonVariants('primary', 'md')}
          >
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

      {error && <Toast message={error} />}
    </>
  )
}

export function AdminLessonFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  // Taxonomy options + (in edit mode) the lesson being edited, in one state.
  const state = useAsync(
    async (signal) => {
      const [taxonomy, lesson] = await Promise.all([
        adminService.taxonomy(signal),
        id
          ? adminService.lesson(id, signal).catch((cause: unknown) => {
              // Unknown id → back to the list (mirrors the old mock lookup).
              if (cause instanceof ApiError && cause.status === 404) return null
              throw cause
            })
          : Promise.resolve(null),
      ])
      return { taxonomy, lesson }
    },
    [id],
  )

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

      <AsyncSection state={state} isEmpty={() => false}>
        {({ taxonomy, lesson }) =>
          isEdit && !lesson ? (
            <Navigate to={APP_ROUTES.ADMIN_LESSONS} replace />
          ) : (
            <LessonForm taxonomy={taxonomy} editing={lesson} />
          )
        }
      </AsyncSection>
    </>
  )
}
