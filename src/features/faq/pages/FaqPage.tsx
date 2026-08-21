import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import { FaqAccordion } from '@/features/faq/components'
import { faqService } from '@/features/faq/services/faq.service'

export function FaqPage() {
  const state = useAsync((signal) => faqService.list(signal))

  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        subtitle="Get instant access to ready-to-teach ESL conversation lessons designed to save you time and engage your students—every single class."
      />

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <AsyncSection state={state}>
            {(faqs) => <FaqAccordion items={faqs} />}
          </AsyncSection>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
