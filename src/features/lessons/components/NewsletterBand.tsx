import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/shared/components'
import { ApiError } from '@/service'
import { contentService } from '@/features/landing'

interface Feedback {
  text: string
  isError: boolean
}

/** Newsletter signup band shown under the lesson detail. */
export function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setFeedback(null)
    try {
      await contentService.subscribeToNewsletter(email)
      setEmail('')
      setFeedback({
        text: "You're subscribed — new lessons will land in your inbox.",
        isError: false,
      })
    } catch (error) {
      setFeedback({
        text:
          error instanceof ApiError
            ? error.message
            : 'Could not subscribe. Please try again.',
        isError: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-accent-700">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-cream">
          Get new lessons in your inbox
        </h2>
        <p className="mt-2 text-sm text-cream/80">
          One email when fresh lessons and teaching ideas are published. No
          spam, unsubscribe anytime.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label className="flex-1">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-cream/30 bg-white px-4 py-3 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none"
            />
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
          </Button>
        </form>

        {/* aria-live so screen readers announce the inline result. */}
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 min-h-5 text-sm ${
            feedback?.isError ? 'text-brand-200' : 'text-cream'
          }`}
        >
          {feedback?.text}
        </p>
      </div>
    </section>
  )
}
