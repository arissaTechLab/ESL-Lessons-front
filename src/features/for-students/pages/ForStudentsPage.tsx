import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'

export function ForStudentsPage() {
  const [copied, setCopied] = useState(false)
  const siteUrl = window.location.origin

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const mailto = `mailto:?subject=${encodeURIComponent(
    'ESL lessons for our classes',
  )}&body=${encodeURIComponent(
    `Hi! I found these ESL conversation lessons I’d love to use in our sessions: ${siteUrl}\n\nWould you consider teaching with them?`,
  )}`

  return (
    <>
      <PageHeader
        title="For Students"
        subtitle="Love these lessons? Here’s the best way to actually use them."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-2xl font-bold leading-tight text-ink sm:text-3xl">
          These materials are made to be taught — not self-studied.
        </h2>
        <p className="mt-4 text-ink-soft">
          Hi, and welcome! If you’re a student, we’re so glad you found us. Just
          one thing to know: these ESL lessons are designed for live classes
          with a tutor. The discussions, role-plays and speaking activities are
          built to come alive with a teacher guiding the conversation — they’re
          not meant for studying on your own.
        </p>

        <div className="mt-10 rounded-2xl border border-ink/10 bg-cream p-6 sm:p-8">
          <h3 className="font-heading text-lg font-bold text-ink">
            Love them? Send them to your tutor.
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            The best thing you can do is share this site with your English tutor
            and suggest they teach with it. Your classes will be more engaging
            and fun — and you’ll get to talk about real, current topics instead
            of dusty worksheets.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyLink}
              className={buttonVariants('primary', 'md')}
            >
              {copied ? 'Link copied!' : 'Copy link to share'}
            </button>
            <a href={mailto} className={buttonVariants('secondary', 'md')}>
              Email your tutor
            </a>
            <Link
              to={APP_ROUTES.ALL_LESSONS}
              className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              See what’s inside →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
