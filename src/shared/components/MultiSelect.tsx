import { useEffect, useRef, useState } from 'react'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  label: string
  options: readonly MultiSelectOption[]
  selected: readonly string[]
  onChange: (selected: string[]) => void
  className?: string
}

/**
 * Dropdown with checkboxes, used for the level / category / topic filters.
 * Closes on outside click and on Escape.
 */
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const toggle = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter((entry) => entry !== value)
        : [...selected, value],
    )

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition hover:border-ink/30 focus:border-brand-500 focus:outline-none"
      >
        <span className="truncate">
          {label}
          {selected.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-500 px-1.5 text-xs font-semibold text-white">
              {selected.length}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`size-4 shrink-0 transition ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-56 overflow-y-auto rounded-xl border border-ink/10 bg-cream p-1 shadow-lg"
        >
          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-ink-muted">No options yet.</p>
          )}
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-ink/5"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="size-4 accent-brand-600"
              />
              {option.label}
            </label>
          ))}

          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-brand-600 transition hover:bg-ink/5"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}
