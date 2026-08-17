import { useId } from 'react'
import type { DownloadsPoint } from '@/features/admin-dashboard/types/admin-dashboard.types'

interface BarChartProps {
  data: DownloadsPoint[]
  /** Accessible name of the chart, e.g. "Downloads over the last 6 months". */
  title: string
  /** Longer accessible description of what the chart shows. */
  description: string
}

// ViewBox coordinates — the SVG scales to its container, so these are ratios.
const WIDTH = 640
const HEIGHT = 260
const MARGIN = { top: 12, right: 8, bottom: 30, left: 48 } as const
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom
const TICK_COUNT = 4
const BAR_MAX_WIDTH = 24

const count = new Intl.NumberFormat('en-US')

/**
 * Smallest "nice" integer step (1/2/2.5/5 × 10ⁿ) whose four intervals cover
 * the peak. Never below 1, so an all-zero dataset still gets a real axis
 * instead of a division by zero. 2.5 is skipped at magnitude 1 to keep
 * download counts on whole-number ticks.
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

/** Column with a rounded data-end and a square baseline. */
function columnPath(x: number, y: number, width: number, height: number): string {
  const r = Math.min(4, width / 2, height)
  return [
    `M ${x} ${y + height}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `L ${x + width} ${y + height}`,
    'Z',
  ].join(' ')
}

/**
 * Grouped bar chart for the Slides vs PDF downloads. Inline SVG on purpose —
 * the project has no charting library and this stays responsive via viewBox.
 */
export function BarChart({ data, title, description }: BarChartProps) {
  const titleId = useId()
  const descId = useId()

  if (data.length === 0) return null

  const step = tickStep(Math.max(...data.map((d) => Math.max(d.slides, d.pdf))))
  const axisMax = step * TICK_COUNT
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * step)

  const band = PLOT_W / data.length
  const barWidth = Math.min(BAR_MAX_WIDTH, band / 3)
  const y = (value: number) => MARGIN.top + PLOT_H - (value / axisMax) * PLOT_H

  return (
    <figure>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand-700" aria-hidden="true" />
          Slides
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-accent-700" aria-hidden="true" />
          PDF plans
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-3 w-full"
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
              {count.format(tick)}
            </text>
          </g>
        ))}

        {data.map((point, index) => {
          const center = MARGIN.left + band * index + band / 2
          const baseline = MARGIN.top + PLOT_H

          return (
            <g key={point.month}>
              {point.slides > 0 && (
                <path
                  d={columnPath(
                    center - barWidth - 1,
                    y(point.slides),
                    barWidth,
                    baseline - y(point.slides),
                  )}
                  className="fill-brand-700"
                />
              )}
              {point.pdf > 0 && (
                <path
                  d={columnPath(
                    center + 1,
                    y(point.pdf),
                    barWidth,
                    baseline - y(point.pdf),
                  )}
                  className="fill-accent-700"
                />
              )}
              <text
                x={center}
                y={HEIGHT - 10}
                textAnchor="middle"
                fontSize="11"
                className="fill-ink-muted"
              >
                {point.label}
              </text>
              {/* Full-band hit area so hovering anywhere in the month works. */}
              <rect
                x={MARGIN.left + band * index}
                y={MARGIN.top}
                width={band}
                height={PLOT_H}
                fill="transparent"
              >
                <title>
                  {`${point.label}: ${count.format(point.slides)} slides, ${count.format(point.pdf)} PDF plans`}
                </title>
              </rect>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
