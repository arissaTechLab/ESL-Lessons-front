import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { TestimonialsSection } from '@/features/landing'
import { PricingCard } from '@/features/pricing/components'
import { pricingService } from '@/features/pricing/services/pricing.service'

export function PricingPage() {
  const state = useAsync((signal) => pricingService.list(signal))

  return (
    <>
      <PageHeader
        title="Choose Your Plan, Simplify Your Life"
        subtitle="Get instant access to ready-to-teach ESL conversation lessons designed to save you time and delight your students - every single class."
      />

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">
          All the materials. None of the prep.
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-ink sm:text-4xl">
          Just enjoy teaching and connecting
        </h2>
        <p className="mt-3 text-ink-soft">
          Choose the plan that fits your teaching routine.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <AsyncSection state={state}>
          {(plans) => (
            <div className="grid gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </AsyncSection>

        {/* Fine print */}
        <div className="mx-auto mt-10 max-w-2xl border-t border-ink/10 pt-6 text-left">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
            Cancel anytime
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink-soft">
              A Note on Access:
            </span>{' '}
            Because the entire digital library is available for instant access
            and is copiable, all sales are final and no refunds will be issued
            for the initial 6-month or annual payment. You may cancel your
            subscription at any time to prevent future billing.
          </p>
        </div>
      </section>

      <TestimonialsSection variant="accent" />
    </>
  )
}
