import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError } from '@/service'
import { contentService } from '@/features/landing'

type Status = 'idle' | 'sending' | 'subscribed' | 'error'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setError(null)
    try {
      await contentService.subscribe(email)
      setStatus('subscribed')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl bg-accent-300 px-8 py-10 sm:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
              Maybe a newsletter?
            </h2>
            <p className="mt-1 text-ink-soft">Lorem lorem lorem</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full gap-2 md:max-w-md">
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-ink/15 bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="shrink-0 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-accent-300 disabled:opacity-60"
            >
              {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        </div>

        {status === 'subscribed' && (
          <p role="status" className="mt-4 text-sm font-medium text-ink">
            Thanks for subscribing! Check your inbox for future updates.
          </p>
        )}
        {status === 'error' && error && (
          <p role="status" className="mt-4 text-sm font-medium text-ink">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
