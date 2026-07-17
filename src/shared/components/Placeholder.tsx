import type { ReactNode } from 'react'

interface PlaceholderProps {
  /** Text shown when no children are provided. */
  label?: string
  /** Extra classes — control size, aspect ratio and rounding from the caller. */
  className?: string
  /** Custom overlay content (e.g. a play button for a video placeholder). */
  children?: ReactNode
}

/**
 * Business-agnostic placeholder for images and media that will be supplied
 * later. Renders a dashed frame with a centered label so the layout reads
 * clearly before real assets are dropped in.
 */
export function Placeholder({
  label = 'Image placeholder',
  className = '',
  children,
}: PlaceholderProps) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-ink/15 bg-accent-100 text-ink-muted ${className}`}
      aria-hidden="true"
    >
      {children ?? (
        <span className="px-4 text-center text-sm font-medium">{label}</span>
      )}
    </div>
  )
}
