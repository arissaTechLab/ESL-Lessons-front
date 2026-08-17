import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import { FaqAccordion } from '@/features/faq/components'
import { faqService } from '@/features/faq/services/faq.service'

export function FaqPage() {
  const state = useAsync((signal) => faqService.list(signal), [])

  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        subtitle="Get instant access to ready-to-teach ESL conversation lessons designed to save you time and engage your students—every single class."
      />

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <AsyncSection
            state={state}
            skeleton={
              <div className="space-y-4" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg bg-accent-100"
                  />
                ))}
              </div>
            }
            empty={
              <p className="py-6 text-center text-sm text-ink-muted">
                No questions published yet.
              </p>
            }
          >
            {(faqs) => <FaqAccordion items={faqs} />}
          </AsyncSection>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
