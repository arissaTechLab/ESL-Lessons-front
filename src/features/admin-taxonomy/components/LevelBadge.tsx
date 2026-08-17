import type { Level } from '@/features/admin-taxonomy/types/taxonomy.types'

interface LevelBadgeProps {
  /** Only the visual fields are needed, so the create form can pass a draft. */
  level: Pick<Level, 'name' | 'cefr' | 'color' | 'textColor'>
  className?: string
}

/**
 * Coloured level pill shared by the taxonomy panel, its live preview and the
 * admin lessons table.
 */
export function LevelBadge({ level, className = '' }: LevelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${className}`}
      // The badge colour is data managed from the Taxonomy screen, not a token.
      style={{ backgroundColor: level.color, color: level.textColor }}
    >
      {level.name}
      {level.cefr.length > 0 && (
        <span className="font-normal opacity-80">({level.cefr.join('/')})</span>
      )}
    </span>
  )
}
