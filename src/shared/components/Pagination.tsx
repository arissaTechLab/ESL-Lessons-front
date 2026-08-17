interface PaginationProps {
  page: number
  pages: number
  onChange: (page: number) => void
}

/** Prev / page-of / next. Renders nothing while everything fits on one page. */
export function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null

  const button =
    'rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink-soft transition hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <button
        type="button"
        className={button}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span className="text-sm text-ink-muted">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
      >
        Next
      </button>
    </nav>
  )
}
