import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import type { LegalContent } from '../data/legal.types'

interface LegalPageProps {
  title: string
  content: LegalContent
}

/**
 * Renders one paragraph string. If it contains bullet markers (● or •), the
 * text before the first marker becomes a lead paragraph and each marked item
 * becomes its own list entry — so bullets stack vertically instead of running
 * together. Plain paragraphs render as a single <p>.
 */
function LegalParagraph({ text }: { text: string }) {
  const parts = text.split(/\s*[●•]\s*/)
  const lead = parts[0]?.trim() ?? ''
  const bullets = parts
    .slice(1)
    .map((item) => item.trim())
    .filter(Boolean)

  if (bullets.length === 0) {
    return <p>{text.trim()}</p>
  }

  return (
    <>
      {lead && <p>{lead}</p>}
      <ul className="list-disc space-y-2 pl-5 marker:text-brand-500">
        {bullets.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )
}

/**
 * Shared layout for legal / text-heavy pages (Privacy Policy, Terms of
 * Service). Reuses the subpage `PageHeader` and the marketing CTA. The actual
 * text of each page lives in its own data file (see `../data`).
 */
export function LegalPage({ title, content }: LegalPageProps) {
  return (
    <>
      <PageHeader title={title} subtitle={content.subtitle} />

      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Last updated: {content.lastUpdated}
          </p>

          <div className="mt-8 space-y-10">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-lg font-bold text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4 text-sm leading-relaxed text-ink-soft">
                  {section.paragraphs.map((paragraph, index) => (
                    <LegalParagraph key={index} text={paragraph} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
