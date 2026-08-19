import { LEVEL_META } from '../data/levels'
import type { LessonLevel } from '../types/lesson.types'

interface LessonLevelBadgeProps {
  level: LessonLevel
  /** Compact chip (just the CEFR tags) — e.g. for tables. */
  compact?: boolean
  /** Colored bar with only the CEFR tag chips (no level label). */
  tagsOnly?: boolean
  /** Rounding for the default bar (e.g. "rounded-b-lg" to join it to an image). */
  className?: string
}

/**
 * Colored level indicator. The background/text colors are predetermined per
 * level (see `LEVEL_META`).
 * - Default: full-width strip with the label + CEFR tag chips.
 * - `tagsOnly`: colored bar with just the CEFR chips (used on cards).
 * - `compact`: a small chip with only the CEFR tags (used in tables).
 */
export function LessonLevelBadge({
  level,
  compact = false,
  tagsOnly = false,
  className = 'rounded-md',
}: LessonLevelBadgeProps) {
  const meta = LEVEL_META[level]

  if (tagsOnly) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 align-middle"
        style={{ backgroundColor: meta.bg, color: meta.text }}
        title={meta.label}
      >
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-white/70 px-1.5 py-0.5 text-xs font-bold"
          >
            {tag}
          </span>
        ))}
      </span>
    )
  }

  if (compact) {
    return (
      <span
        className="inline-block whitespace-nowrap rounded px-2 py-1 text-xs font-bold"
        style={{ backgroundColor: meta.bg, color: meta.text }}
        title={meta.label}
      >
        {meta.tags.join('/')}
      </span>
    )
  }

  return (
    <div
      className={`flex min-h-[2.5rem] items-center justify-between gap-1.5 px-2 py-1 ${className}`}
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      <span className="text-[10px] font-bold uppercase leading-tight">
        {meta.label}
      </span>
      <span className="flex shrink-0 gap-1">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-white/70 px-1.5 py-0.5 text-xs font-bold"
          >
            {tag}
          </span>
        ))}
      </span>
    </div>
  )
}
