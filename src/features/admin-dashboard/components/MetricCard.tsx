interface MetricCardProps {
  label: string
  /** Pre-formatted — the caller owns number/currency formatting. */
  value: string
  /** Optional context line under the value, e.g. "+12% this month". */
  delta?: string
  deltaTone?: 'positive' | 'negative' | 'neutral'
}

const DELTA_TONES = {
  positive: 'text-accent-700',
  negative: 'text-red-600',
  neutral: 'text-ink-muted',
} as const

/** Stat tile used across the admin reporting screens. */
export function MetricCard({
  label,
  value,
  delta,
  deltaTone = 'neutral',
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-extrabold text-ink">{value}</p>
      {delta && (
        <p className={`mt-1 text-xs font-semibold ${DELTA_TONES[deltaTone]}`}>
          {delta}
        </p>
      )}
    </div>
  )
}
