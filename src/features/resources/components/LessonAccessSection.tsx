import type { ReactNode } from 'react'
import { Placeholder } from '@/shared/components'

const STEPS: readonly string[] = [
  'Log in to your Fluentize account.',
  'Navigate to the lesson page you’d like.',
  'Unlock the lesson by clicking the button.',
  'Click on the Google Slide E-Lesson link.',
  'Download the Teacher Guide separately.',
]

interface LessonAccessSectionProps {
  /** Section heading — differs per page (e.g. "Using the lessons"). */
  title: string
  /** Supporting paragraphs shown under the shared step list. */
  children: ReactNode
}

/**
 * Two-column "how to access a lesson" block shared by the Google Slides and
 * Teaching Ideas pages. The step list is common; the trailing copy varies.
 */
export function LessonAccessSection({ title, children }: LessonAccessSectionProps) {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start">
        <Placeholder label="Image" className="aspect-[4/3] w-full" />

        <div>
          <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            {title}
          </h2>
          <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-ink-soft marker:text-brand-500">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="mt-5 space-y-4 text-sm text-ink-soft">{children}</div>
        </div>
      </div>
    </section>
  )
}
