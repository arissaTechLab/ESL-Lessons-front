import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AsyncSection, Button, Pagination } from '@/shared/components'
import { useAsync } from '@/hooks'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import { ApiError } from '@/service'
import { APP_ROUTES } from '@/config/routes.constants'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import type { LessonComment } from '@/features/lessons/types/lesson.types'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function CommentItem({ comment }: { comment: LessonComment }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-200 text-sm font-semibold text-accent-800"
      >
        {comment.author.initials}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">
          {comment.author.fullName}
          <span className="ml-2 text-xs font-normal text-ink-muted">
            {formatDate(comment.createdAt)}
          </span>
        </p>
        <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">
          {comment.body}
        </p>
      </div>
    </li>
  )
}

/**
 * Comment list + post box for the lesson detail page. Logged-out visitors get
 * a "Log in to comment" link instead of the box.
 */
export function LessonComments({ slug }: { slug: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const notify = useToastStore((state) => state.notify)

  const [page, setPage] = useState(1)
  // Bumped after a successful post so the list refetches with the new comment.
  const [version, setVersion] = useState(0)
  const [draft, setDraft] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const state = useAsync(
    (signal) => lessonsService.comments(slug, page, signal),
    [slug, page, version],
  )

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body || isPosting) return

    setIsPosting(true)
    try {
      await lessonsService.addComment(slug, body)
      setDraft('')
      setPage(1)
      setVersion((current) => current + 1)
      notify('Comment posted.')
    } catch (error) {
      notify(
        error instanceof ApiError
          ? error.message
          : 'Could not post your comment. Please try again.',
        'error',
      )
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <section aria-labelledby="lesson-comments-title">
      <h2
        id="lesson-comments-title"
        className="font-heading text-2xl font-bold text-ink"
      >
        Comments
      </h2>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mt-6">
          <label htmlFor="lesson-comment-body" className="sr-only">
            Write a comment
          </label>
          <textarea
            id="lesson-comment-body"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Share how the lesson went for you…"
            className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isPosting || draft.trim() === ''}
            >
              {isPosting ? 'Posting…' : 'Post comment'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-6 rounded-xl border border-ink/10 bg-cream px-5 py-4 text-sm text-ink-soft">
          <Link
            to={APP_ROUTES.LOGIN}
            className="font-semibold text-brand-600 hover:underline"
          >
            Log in to comment
          </Link>{' '}
          and share how the lesson went for you.
        </p>
      )}

      <div className="mt-8">
        <AsyncSection
          state={state}
          skeleton={
            <div className="space-y-4" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-accent-100"
                />
              ))}
            </div>
          }
          isEmpty={(result) => result.items.length === 0}
          empty={
            <p className="py-6 text-center text-sm text-ink-muted">
              No comments yet — be the first to share your thoughts.
            </p>
          }
        >
          {(result) => (
            <>
              <ul className="space-y-6">
                {result.items.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </ul>
              <Pagination
                page={result.page}
                pages={result.pages}
                onChange={setPage}
              />
            </>
          )}
        </AsyncSection>
      </div>
    </section>
  )
}
