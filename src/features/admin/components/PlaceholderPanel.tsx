import type { ReactNode } from 'react'

/** Empty-state panel for admin screens we haven't built out yet. */
export function PlaceholderPanel({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[320px] place-items-center rounded-xl border-2 border-dashed border-ink/15 bg-white/50 text-center">
      <p className="max-w-sm px-6 text-sm text-ink-muted">{children}</p>
    </div>
  )
}
