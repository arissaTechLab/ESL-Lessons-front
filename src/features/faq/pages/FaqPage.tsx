import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import { FaqAccordion } from '@/features/faq/components'
import { FAQS } from '@/features/faq/data/faqs'

export function FaqPage() {
  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        subtitle="Get instant access to ready-to-teach ESL conversation lessons designed to save you time and engage your students—every single class."
      />

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <CtaSection />
    </>
  )
}
