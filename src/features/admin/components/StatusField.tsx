type PublishStatus = 'published' | 'draft'

/** Segmented Draft/Published control for admin forms. */
export function StatusField({
  value,
  onChange,
}: {
  value: PublishStatus
  onChange: (value: PublishStatus) => void
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-ink">Status</span>
      <div className="inline-flex rounded-lg border border-ink/15 bg-white p-1">
        {(['draft', 'published'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition ${
              value === option
                ? 'bg-brand-500 text-white'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
