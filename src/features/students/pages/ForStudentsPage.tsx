import { useEffect, useRef, useState } from 'react'
import { Button, PageHeader, buttonVariants } from '@/shared/components'

type CopyStatus = 'idle' | 'copied' | 'failed'

/**
 * Copies via the async Clipboard API, falling back to the legacy
 * textarea + execCommand path for browsers (or contexts) without it.
 */
async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or insecure context — try the legacy path below.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  // Off-screen but selectable; not JSX styling, just a transient helper node.
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  let ok: boolean
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}

function buildMailtoHref(siteUrl: string): string {
  const subject = encodeURIComponent(
    'A lesson library I would love to use in our classes',
  )
  const body = encodeURIComponent(
    `Hi!\n\n` +
      `I found a library of ready-to-teach ESL conversation lessons and ` +
      `thought it could be great for our classes. Would you take a look?\n\n` +
      `${siteUrl}\n\n` +
      `Thank you!`,
  )
  return `mailto:?subject=${subject}&body=${body}`
}

export function ForStudentsPage() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const resetTimer = useRef<number | undefined>(undefined)

  // Don't let a pending "Copied!" reset fire after the page unmounts.
  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const handleCopy = async () => {
    const ok = await copyText(window.location.origin)
    setCopyStatus(ok ? 'copied' : 'failed')
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 2000)
  }

  return (
    <>
      <PageHeader
        title="A quick note for students"
        subtitle="These lessons are made for teachers — but you can still be the one who brings them to class."
      />

      <section>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            Learning works best with a tutor by your side
          </h2>

          <div className="mt-6 space-y-4 text-ink-soft">
            <p>
              We are so glad you found us! These materials are conversation
              lessons designed for a tutor to teach with — they come alive in a
              live class, with someone guiding the discussion, correcting
              gently and keeping you talking. They are not built for
              self-study, and working through them alone would mean missing
              the best part.
            </p>
            <p>
              If the topics look interesting, the kindest thing you can do for
              your English is to share this site with your teacher. They get
              ready-to-teach classes, and you get better conversations — a win
              for both of you.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" onClick={() => void handleCopy()}>
              {copyStatus === 'copied' ? 'Copied!' : 'Copy the link'}
            </Button>
            <a
              href={buildMailtoHref(window.location.origin)}
              className={buttonVariants('secondary')}
            >
              Email my tutor
            </a>
          </div>

          {/* Announce copy feedback to screen readers as well. */}
          <p role="status" className="mt-4 min-h-5 text-sm text-ink-muted">
            {copyStatus === 'copied' && 'Link copied to your clipboard.'}
            {copyStatus === 'failed' &&
              'Copying is not available in this browser — you can copy the address from the address bar instead.'}
          </p>
        </div>
      </section>
    </>
  )
}
