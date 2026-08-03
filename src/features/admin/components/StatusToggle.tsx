type PublishStatus = 'published' | 'draft'

/** Compact publish/draft switch for table rows. */
export function StatusToggle({
  status,
  onToggle,
}: {
  status: PublishStatus
  onToggle: () => void
}) {
  const published = status === 'published'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      onClick={onToggle}
      className="flex items-center gap-2"
      title={
        published
          ? 'Published — click to unpublish'
          : 'Draft — click to publish'
      }
    >
      <span
        className={`relative h-5 w-9 rounded-full transition ${published ? 'bg-emerald-500' : 'bg-ink/20'}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all ${published ? 'left-[18px]' : 'left-0.5'}`}
        />
      </span>
      <span
        className={`text-xs font-semibold ${published ? 'text-emerald-700' : 'text-ink-soft'}`}
      >
        {published ? 'Published' : 'Draft'}
      </span>
    </button>
  )
}
