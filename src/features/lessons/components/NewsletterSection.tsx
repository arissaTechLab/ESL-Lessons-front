import type { FormEvent } from 'react'

export function NewsletterSection() {
  const handleSubmit = (event: FormEvent) => event.preventDefault()

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
              className="w-full rounded-md border border-ink/15 bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-accent-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
