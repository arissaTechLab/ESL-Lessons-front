import { PageHeader } from '@/shared/components'
import { TestimonialsSection } from '@/features/landing'
import { PricingCard } from '@/features/pricing/components'
import { PRICING_PLANS } from '@/features/pricing/data/plans'

export function PricingPage() {
  return (
    <>
      <PageHeader
        title="Choose Your Plan, Simplify Your Prep"
        subtitle="Get instant access to ready-to-teach ESL conversation lessons designed to save you time and engage your students—every single class."
      />

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">
          Everything you need. None of the prep.
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-ink sm:text-4xl">
          Start Teaching Smarter
        </h2>
        <p className="mt-3 text-ink-soft">
          Choose the plan that fits your teaching routine.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <TestimonialsSection variant="accent" />
    </>
  )
}
