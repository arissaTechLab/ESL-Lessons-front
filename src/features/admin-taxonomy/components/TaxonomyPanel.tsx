import type { ReactNode } from 'react'

interface TaxonomyPanelProps {
  title: string
  count: number
  /** The rows — already wrapped in `<PanelRow>`s. */
  children: ReactNode
  /** Create form pinned at the bottom of the card. */
  form: ReactNode
}

/** One of the three side-by-side cards on the Taxonomy screen. */
export function TaxonomyPanel({ title, count, children, form }: TaxonomyPanelProps) {
  return (
    <section className="flex flex-col rounded-xl border border-ink/10 bg-white p-5">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
        <span className="text-xs font-semibold text-ink-muted">{count}</span>
      </header>

      <ul className="mt-4 flex-1 space-y-1">{children}</ul>

      <div className="mt-4 border-t border-ink/10 pt-4">{form}</div>
    </section>
  )
}

interface PanelRowProps {
  children: ReactNode
  /** Accessible name for the icon-only delete button. */
  deleteLabel: string
  onDelete: () => void
}

export function PanelRow({ children, deleteLabel, onDelete }: PanelRowProps) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition hover:bg-ink/5">
      <div className="min-w-0 flex-1 text-sm text-ink">{children}</div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={deleteLabel}
        className="shrink-0 rounded-lg p-1.5 text-ink-muted transition hover:bg-red-50 hover:text-red-600"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </li>
  )
}
