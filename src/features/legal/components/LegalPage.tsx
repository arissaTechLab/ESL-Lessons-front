import type { ReactNode } from 'react'
import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'

const PLACEHOLDER_PARAGRAPHS: readonly string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.',
  'Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.',
  'Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.',
  'Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.',
]

interface LegalPageProps {
  title: string
  subtitle?: string
  /** Real content later; falls back to the text placeholder for now. */
  children?: ReactNode
}

/**
 * Shared layout for legal / text-heavy pages (Privacy Policy, Terms of
 * Service). Reuses the subpage `PageHeader` and the marketing CTA; the body
 * is a swappable text placeholder.
 */
export function LegalPage({
  title,
  subtitle = 'Here goes the description',
  children,
}: LegalPageProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          {children ?? (
            <>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
                Lindsay’s personalized text goes here
              </h2>
              <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-soft">
                {PLACEHOLDER_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
