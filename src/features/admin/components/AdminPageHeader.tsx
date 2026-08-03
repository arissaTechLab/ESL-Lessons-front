import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  /** Optional primary action (e.g. a "New lesson" button). */
  action?: ReactNode
}

export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
