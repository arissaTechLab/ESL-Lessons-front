import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import type { PricingPlan } from '../data/plans'

function PlanIcon({ featured }: { featured?: boolean }) {
  return (
    <span className="text-brand-500">
      {featured ? (
        <svg
          viewBox="0 0 24 24"
          className="size-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )}
    </span>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 size-4 shrink-0 text-brand-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl p-8 ${
        plan.featured ? 'bg-[#ece6d8]' : 'bg-accent-300'
      }`}
    >
      {plan.badge && (
        <span className="absolute right-6 top-6 rounded-full border border-ink/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
          {plan.badge}
        </span>
      )}

      <PlanIcon featured={plan.featured} />

      <h3 className="mt-5 font-heading text-lg font-bold uppercase tracking-wide text-ink">
        {plan.name}
      </h3>
      <p className="mt-2 text-sm text-ink-soft">{plan.description}</p>

      <div className="my-6 border-t border-ink/15" />

      <div className="flex items-baseline gap-1">
        <span className="font-heading text-4xl font-extrabold text-ink">
          {plan.price}
        </span>
        <span className="text-sm text-ink-soft">{plan.period}</span>
      </div>
      <p className="mt-1 text-xs text-ink-muted">{plan.billingNote}</p>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Link
          to={APP_ROUTES.SIGNUP}
          className={buttonVariants('primary', 'md', 'w-full')}
        >
          {plan.ctaLabel}
        </Link>
      </div>
    </div>
  )
}
