import { useId } from 'react'
import type { RevenuePoint } from '@/features/admin-revenue/types/admin-revenue.types'

interface LineChartProps {
  data: RevenuePoint[]
  /** Accessible name of the chart, e.g. "Revenue over the last 12 months". */
  title: string
  /** Longer accessible description of what the chart shows. */
  description: string
}

// ViewBox coordinates — the SVG scales to its container, so these are ratios.
const WIDTH = 720
const HEIGHT = 260
const MARGIN = { top: 14, right: 14, bottom: 30, left: 56 } as const
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom
const TICK_COUNT = 4

const axisCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const pointCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/**
 * Smallest "nice" step (1/2/2.5/5 × 10ⁿ) whose four intervals cover the
 * peak. Never below 1, so an all-zero year still gets a real axis instead
 * of a division by zero. 2.5 is skipped at magnitude 1 to keep small
 * amounts on whole-dollar ticks.
 */
function tickStep(max: number): number {
  if (max <= TICK_COUNT) return 1
  const raw = max / TICK_COUNT
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  for (const factor of [1, 2, 2.5, 5, 10]) {
    if (factor === 2.5 && magnitude < 10) continue
    if (factor * magnitude >= raw) return factor * magnitude
  }
  return 10 * magnitude
}

/** Monthly revenue as an inline-SVG line: polyline, point markers, soft wash. */
export function LineChart({ data, title, description }: LineChartProps) {
  const titleId = useId()
  const descId = useId()

  if (data.length === 0) return null

  const step = tickStep(Math.max(...data.map((d) => d.revenue)))
  const axisMax = step * TICK_COUNT
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * step)

  const band = PLOT_W / data.length
  const x = (index: number) =>
    data.length === 1
      ? MARGIN.left + PLOT_W / 2
      : MARGIN.left + (index / (data.length - 1)) * PLOT_W
  const y = (value: number) => MARGIN.top + PLOT_H - (value / axisMax) * PLOT_H

  const linePoints = data
    .map((point, index) => `${x(index)},${y(point.revenue)}`)
    .join(' ')
  const baseline = MARGIN.top + PLOT_H
  const areaPoints = `${MARGIN.left},${baseline} ${linePoints} ${MARGIN.left + PLOT_W},${baseline}`

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{description}</desc>

      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={y(tick)}
            y2={y(tick)}
            strokeWidth="1"
            className={tick === 0 ? 'stroke-ink/20' : 'stroke-ink/10'}
          />
          <text
            x={MARGIN.left - 8}
            y={y(tick) + 3.5}
            textAnchor="end"
            fontSize="10"
            className="fill-ink-muted tabular-nums"
          >
            {axisCurrency.format(tick)}
          </text>
        </g>
      ))}

      {/* Soft wash under the line keeps the trend readable at a glance. */}
      <polygon points={areaPoints} className="fill-brand-700/10" />
      <polyline
        points={linePoints}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand-700"
      />

      {data.map((point, index) => (
        <g key={point.month}>
          {/* White ring keeps markers legible where they sit on the line. */}
          <circle
            cx={x(index)}
            cy={y(point.revenue)}
            r={4}
            strokeWidth="2"
            className="fill-brand-700 stroke-white"
          />
          <text
            x={x(index)}
            y={HEIGHT - 10}
            textAnchor="middle"
            fontSize="10"
            className="fill-ink-muted"
          >
            {point.label}
          </text>
          {/* Full-band hit area so hovering anywhere in the month works. */}
          <rect
            x={x(index) - band / 2}
            y={MARGIN.top}
            width={band}
            height={PLOT_H}
            fill="transparent"
          >
            <title>{`${point.label}: ${pointCurrency.format(point.revenue)}`}</title>
          </rect>
        </g>
      ))}
    </svg>
  )
}
