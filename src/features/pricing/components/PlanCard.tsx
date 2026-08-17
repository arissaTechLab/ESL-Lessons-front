import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import type { Plan } from '@/features/pricing/types/pricing.types'

/** `59` + `'USD'` → `$59`; keeps cents when the amount isn't whole. */
function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price)
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 size-4 shrink-0 text-accent-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border-2 bg-cream p-8 ${
        plan.isFeatured ? 'border-brand-500 shadow-lg' : 'border-ink/10'
      }`}
    >
      {plan.isFeatured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Best value
        </span>
      )}

      <h3 className="font-heading text-lg font-semibold text-ink">
        {plan.name}
      </h3>

      <p className="mt-3">
        <span className="font-heading text-5xl font-bold text-ink">
          {formatPrice(plan.price, plan.currency)}
        </span>
        <span className="ml-1 text-sm text-ink-muted">
          / {plan.durationMonths} months
        </span>
      </p>

      <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-soft">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={APP_ROUTES.SIGNUP}
        className={buttonVariants(
          plan.isFeatured ? 'primary' : 'secondary',
          'md',
          'mt-8 w-full',
        )}
      >
        Subscribe now
      </Link>
    </article>
  )
}
