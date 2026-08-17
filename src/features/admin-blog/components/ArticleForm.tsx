import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  Button,
  Placeholder,
  StatusSwitch,
  buttonVariants,
} from '@/shared/components'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import { adminBlogService } from '@/features/admin-blog/services/admin-blog.service'
import type {
  AdminArticle,
  ArticleDto,
  ArticleSection,
} from '@/features/admin-blog/types/admin-blog.types'

const FIELD =
  'w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

const LABEL = 'block text-sm font-medium text-ink'

interface ArticleFormProps {
  /** Existing article when editing; omitted when creating. */
  article?: AdminArticle
}

/** Create/edit form shared by both blog admin routes. Saves, toasts, returns. */
export function ArticleForm({ article }: ArticleFormProps) {
  const navigate = useNavigate()
  const notify = useToastStore((store) => store.notify)

  const [title, setTitle] = useState(article?.title ?? '')
  const [category, setCategory] = useState(article?.category ?? '')
  const [section, setSection] = useState<ArticleSection>(
    article?.section ?? 'how-to',
  )
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [imageUrl, setImageUrl] = useState<string | null>(
    article?.imageUrl ?? null,
  )
  const [isPublished, setIsPublished] = useState(
    article?.status === 'published',
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const result = await adminBlogService.upload(file)
      setImageUrl(result.url)
    } catch (error) {
      notify(
        error instanceof ApiError
          ? error.message
          : 'Could not upload the image.',
        'error',
      )
    } finally {
      setIsUploading(false)
      // Allow re-selecting the same file after a failed or replaced upload.
      input.value = ''
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const dto: ArticleDto = {
      title: title.trim(),
      category: category.trim(),
      section,
      excerpt: excerpt.trim(),
      content,
      imageUrl,
      status: isPublished ? 'published' : 'draft',
    }

    setIsSaving(true)
    try {
      if (article) {
        await adminBlogService.update(article.id, dto)
        notify('Article saved.')
      } else {
        await adminBlogService.create(dto)
        notify('Article created.')
      }
      navigate(APP_ROUTES.ADMIN_BLOG)
    } catch (error) {
      notify(
        error instanceof ApiError
          ? error.message
          : 'Could not save the article.',
        'error',
      )
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-5">
      <StatusSwitch isOn={isPublished} onChange={setIsPublished} />

      <div>
        <label className={LABEL} htmlFor="article-title">
          Title
        </label>
        <input
          id="article-title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={`mt-1.5 ${FIELD}`}
          placeholder="e.g. How to Open a Lesson So Everyone Speaks"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="article-category">
            Category
          </label>
          <input
            id="article-category"
            type="text"
            required
            maxLength={120}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`mt-1.5 ${FIELD}`}
            placeholder="e.g. Method"
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="article-section">
            Section
          </label>
          <select
            id="article-section"
            value={section}
            onChange={(event) =>
              setSection(event.target.value as ArticleSection)
            }
            className={`mt-1.5 ${FIELD}`}
          >
            <option value="how-to">How to</option>
            <option value="teaching-ideas">Teaching Ideas</option>
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="article-excerpt">
          Excerpt
        </label>
        <textarea
          id="article-excerpt"
          required
          maxLength={500}
          rows={2}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className={`mt-1.5 ${FIELD}`}
          placeholder="One or two lines shown on the article card."
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="article-content">
          Content
        </label>
        <textarea
          id="article-content"
          required
          rows={12}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className={`mt-1.5 ${FIELD}`}
          placeholder="The full article body."
        />
      </div>

      <div>
        <span className={LABEL}>Cover image</span>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Article cover preview"
            className="mt-2 aspect-[16/9] w-full max-w-md rounded-lg border border-ink/10 object-cover"
          />
        ) : (
          <Placeholder
            label="No image yet"
            className="mt-2 aspect-[16/9] w-full max-w-md"
          />
        )}
        <div className="mt-2 flex items-center gap-3">
          <label className={buttonVariants('tertiary', 'sm', 'cursor-pointer')}>
            {isUploading
              ? 'Uploading…'
              : imageUrl
                ? 'Replace image'
                : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleUpload}
              className="sr-only"
            />
          </label>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-ink/10 pt-5">
        <Button type="submit" size="sm" disabled={isSaving || isUploading}>
          {isSaving ? 'Saving…' : article ? 'Save changes' : 'Create article'}
        </Button>
        <Link
          to={APP_ROUTES.ADMIN_BLOG}
          className={buttonVariants('tertiary', 'sm')}
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
