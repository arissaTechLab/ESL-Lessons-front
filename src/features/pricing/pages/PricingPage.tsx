import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import { PlanCard } from '@/features/pricing/components'
import { pricingService } from '@/features/pricing/services/pricing.service'

export function PricingPage() {
  const state = useAsync((signal) => pricingService.list(signal), [])

  return (
    <>
      <PageHeader
        title="Pricing"
        subtitle="One simple subscription, the whole lesson library. Pick the plan that fits your teaching year."
      />

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <AsyncSection
            state={state}
            skeleton={
              <div className="grid gap-8 sm:grid-cols-2" aria-hidden="true">
                {Array.from({ length: 2 }, (_, i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-2xl bg-accent-100"
                  />
                ))}
              </div>
            }
            empty={
              <p className="py-6 text-center text-sm text-ink-muted">
                Plans are not available right now — please check back soon.
              </p>
            }
          >
            {(plans) => (
              <div className="grid items-stretch gap-8 pt-4 sm:grid-cols-2">
                {[...plans]
                  .sort((a, b) => a.order - b.order)
                  .map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
              </div>
            )}
          </AsyncSection>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
