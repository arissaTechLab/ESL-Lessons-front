import { LEVEL_META } from '../data/levels'
import type { LessonLevel } from '../types/lesson.types'

/** Colored level pill with CEFR tag chips, matching the lesson design. */
export function LessonLevelBadge({ level }: { level: LessonLevel }) {
  const meta = LEVEL_META[level]

  return (
    <div
      className={`flex items-center justify-between gap-1.5 rounded-md px-2 py-1 ${meta.badgeClass}`}
    >
      <span className="text-[10px] font-bold uppercase leading-tight">
        {meta.label}
      </span>
      <span className="flex shrink-0 gap-1">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-white/70 px-1 text-[10px] font-bold"
          >
            {tag}
          </span>
        ))}
      </span>
    </div>
  )
}
