import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, StatusSwitch, buttonVariants } from '@/shared/components'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import { APP_ROUTES } from '@/config/routes.constants'
import type { TaxonomySnapshot } from '@/features/admin-taxonomy'
import type { LessonAccess } from '@/features/lessons'
import { adminLessonsService } from '@/features/admin-lessons/services/admin-lessons.service'
import type {
  AdminLesson,
  AdminLessonPayload,
  LessonStatus,
  UploadKind,
} from '@/features/admin-lessons/types/admin-lesson.types'

const INPUT =
  'w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

interface FormValues {
  title: string
  category: string
  level: string
  topic: string
  access: LessonAccess
  status: LessonStatus
  googleSlidesUrl: string
  videoUrl: string
  spotifyUrl: string
  pdfPlanUrl: string | null
  imageUrl: string | null
  description: string
  objectives: string
  summary: string
}

function initialValues(lesson: AdminLesson | null): FormValues {
  return {
    title: lesson?.title ?? '',
    category: lesson?.category.id ?? '',
    level: lesson?.level.id ?? '',
    topic: lesson?.topic.id ?? '',
    access: lesson?.access ?? 'paid',
    status: lesson?.status ?? 'draft',
    googleSlidesUrl: lesson?.googleSlidesUrl ?? '',
    videoUrl: lesson?.videoUrl ?? '',
    spotifyUrl: lesson?.spotifyUrl ?? '',
    pdfPlanUrl: lesson?.pdfPlanUrl ?? null,
    imageUrl: lesson?.imageUrl ?? null,
    description: lesson?.description ?? '',
    objectives: lesson?.objectives ?? '',
    summary: lesson?.summary ?? '',
  }
}

function fileName(url: string): string {
  return url.split('/').pop() ?? url
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  )
}

interface UploadFieldProps {
  label: string
  accept: string
  url: string | null
  isBusy: boolean
  /** Renders an image preview of the uploaded file. */
  preview?: boolean
  onSelect: (file: File) => void
  onClear: () => void
}

function UploadField({
  label,
  accept,
  url,
  isBusy,
  preview = false,
  onSelect,
  onClear,
}: UploadFieldProps) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>

      {preview && url && (
        <img
          src={url}
          alt={`${label} preview`}
          className="mb-2 aspect-[16/10] w-full max-w-56 rounded-lg border border-ink/10 object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className={buttonVariants('tertiary', 'sm', 'cursor-pointer')}>
          {isBusy ? 'Uploading…' : url ? 'Replace file' : 'Upload file'}
          <input
            type="file"
            accept={accept}
            disabled={isBusy}
            // Both upload fields say "Upload file" — name them apart for AT.
            aria-label={`${label} file`}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onSelect(file)
              // Reset so re-selecting the same file fires onChange again.
              event.target.value = ''
            }}
          />
        </label>

        {url && (
          <>
            <span className="max-w-48 truncate text-xs text-ink-soft" title={url}>
              {fileName(url)}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  )
}

interface LessonFormProps {
  taxonomy: TaxonomySnapshot
  /** `null` when creating a new lesson. */
  lesson: AdminLesson | null
}

/** The create/edit form. Taxonomy selects always come from `taxonomyService.all()`. */
export function LessonForm({ taxonomy, lesson }: LessonFormProps) {
  const navigate = useNavigate()
  const notify = useToastStore((state) => state.notify)

  const [values, setValues] = useState<FormValues>(() => initialValues(lesson))
  const [uploading, setUploading] = useState<UploadKind | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }))

  const handleUpload = async (file: File, kind: UploadKind) => {
    setUploading(kind)
    try {
      const result = await adminLessonsService.upload(file, kind)
      set(kind === 'image' ? 'imageUrl' : 'pdfPlanUrl', result.url)
      notify(`${result.filename} uploaded.`)
    } catch (error) {
      notify(
        error instanceof ApiError ? error.message : 'Upload failed. Please try again.',
        'error',
      )
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return

    setApiErrors([])
    setIsSaving(true)

    // Empty link inputs mean "no link" — '' would fail the API's URL check.
    const payload: AdminLessonPayload = {
      title: values.title.trim(),
      category: values.category,
      level: values.level,
      topic: values.topic,
      access: values.access,
      status: values.status,
      description: values.description,
      objectives: values.objectives,
      summary: values.summary,
      googleSlidesUrl: values.googleSlidesUrl.trim() || null,
      videoUrl: values.videoUrl.trim() || null,
      spotifyUrl: values.spotifyUrl.trim() || null,
      pdfPlanUrl: values.pdfPlanUrl,
      imageUrl: values.imageUrl,
    }

    try {
      if (lesson) {
        await adminLessonsService.update(lesson.id, payload)
        notify(`"${payload.title}" saved.`)
      } else {
        await adminLessonsService.create(payload)
        notify(`"${payload.title}" created.`)
      }
      navigate(APP_ROUTES.ADMIN_LESSONS)
    } catch (error) {
      if (error instanceof ApiError) {
        setApiErrors(error.details.length > 0 ? error.details : [error.message])
      } else {
        setApiErrors(['Something went wrong. Please try again.'])
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-ink/10 bg-white p-6"
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <StatusSwitch
          isOn={values.status === 'published'}
          onChange={(on) => set('status', on ? 'published' : 'draft')}
        />

        <fieldset>
          <legend className="sr-only">Access</legend>
          <div className="flex items-center gap-4">
            {(['free', 'paid'] as const).map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="radio"
                  name="access"
                  checked={values.access === option}
                  onChange={() => set('access', option)}
                  className="size-4 accent-brand-600"
                />
                {option === 'free' ? 'Free' : 'Paid'}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <Field label="Title">
        <input
          required
          value={values.title}
          onChange={(event) => set('title', event.target.value)}
          placeholder="Lesson title"
          maxLength={200}
          className={INPUT}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Category">
          <select
            required
            value={values.category}
            onChange={(event) => set('category', event.target.value)}
            className={INPUT}
          >
            <option value="" disabled>
              Select a category…
            </option>
            {taxonomy.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Level">
          <select
            required
            value={values.level}
            onChange={(event) => set('level', event.target.value)}
            className={INPUT}
          >
            <option value="" disabled>
              Select a level…
            </option>
            {taxonomy.levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} ({level.cefr.join('/')})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Topic">
          <select
            required
            value={values.topic}
            onChange={(event) => set('topic', event.target.value)}
            className={INPUT}
          >
            <option value="" disabled>
              Select a topic…
            </option>
            {taxonomy.topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Google Slides URL">
          <input
            type="url"
            value={values.googleSlidesUrl}
            onChange={(event) => set('googleSlidesUrl', event.target.value)}
            placeholder="https://docs.google.com/…"
            className={INPUT}
          />
        </Field>

        <Field label="Video URL">
          <input
            type="url"
            value={values.videoUrl}
            onChange={(event) => set('videoUrl', event.target.value)}
            placeholder="https://youtube.com/…"
            className={INPUT}
          />
        </Field>

        <Field label="Spotify URL">
          <input
            type="url"
            value={values.spotifyUrl}
            onChange={(event) => set('spotifyUrl', event.target.value)}
            placeholder="https://open.spotify.com/…"
            className={INPUT}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <UploadField
          label="PDF lesson plan"
          accept="application/pdf"
          url={values.pdfPlanUrl}
          isBusy={uploading === 'pdf'}
          onSelect={(file) => handleUpload(file, 'pdf')}
          onClear={() => set('pdfPlanUrl', null)}
        />

        <UploadField
          label="Cover image"
          accept="image/*"
          url={values.imageUrl}
          isBusy={uploading === 'image'}
          preview
          onSelect={(file) => handleUpload(file, 'image')}
          onClear={() => set('imageUrl', null)}
        />
      </div>

      <Field label="Description">
        <textarea
          rows={3}
          value={values.description}
          onChange={(event) => set('description', event.target.value)}
          placeholder="What the lesson is about."
          className={INPUT}
        />
      </Field>

      <Field label="Objectives">
        <textarea
          rows={3}
          value={values.objectives}
          onChange={(event) => set('objectives', event.target.value)}
          placeholder="What students will be able to do."
          className={INPUT}
        />
      </Field>

      <Field label="Summary">
        <textarea
          rows={3}
          value={values.summary}
          onChange={(event) => set('summary', event.target.value)}
          placeholder="A short recap shown on the lesson page."
          className={INPUT}
        />
      </Field>

      {apiErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-semibold">The lesson could not be saved:</p>
          <ul className="mt-1 list-inside list-disc">
            {apiErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
        <Link to={APP_ROUTES.ADMIN_LESSONS} className={buttonVariants('tertiary', 'sm')}>
          Cancel
        </Link>
        <Button type="submit" size="sm" disabled={isSaving || uploading !== null}>
          {isSaving ? 'Saving…' : lesson ? 'Save changes' : 'Create lesson'}
        </Button>
      </div>
    </form>
  )
}
