import { useDropdown } from '@/shared/hooks/useDropdown'
import type { Folder } from '../store/folders.store'

const UNFILED = 'none'

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4Z" />
    </svg>
  )
}

/**
 * Compact folder selector used on lesson cards and the material detail page.
 * Picking a folder files the lesson; "Uncategorized" removes it from folders.
 */
export function FolderPicker({
  value,
  folders,
  onChange,
}: {
  value: string | null
  folders: readonly Folder[]
  onChange: (folderId: string | null) => void
}) {
  const { open, setOpen, ref } = useDropdown()
  const current = folders.find((f) => f.id === value)

  const options = [
    { value: UNFILED, label: 'Uncategorized' },
    ...folders.map((f) => ({ value: f.id, label: f.name })),
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
          current
            ? 'border-brand-300 bg-brand-50 text-brand-700'
            : 'border-ink/15 bg-white text-ink-soft hover:border-ink/30'
        }`}
      >
        <FolderIcon />
        <span className="min-w-0 flex-1 truncate text-left font-medium">
          {current ? current.name : 'Add to folder'}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`size-3.5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-ink/15 bg-white p-1.5 shadow-lg">
          {options.map((option) => {
            const selected =
              option.value === (value ?? UNFILED)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value === UNFILED ? null : option.value)
                  setOpen(false)
                }}
                className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                  selected
                    ? 'bg-accent-100 font-semibold text-ink'
                    : 'text-ink-soft hover:bg-ink/5'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
