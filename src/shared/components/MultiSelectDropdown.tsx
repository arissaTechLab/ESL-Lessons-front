import { useState } from 'react'
import { useDropdown } from '@/shared/hooks/useDropdown'
import { DROPDOWN_TRIGGER_CLASS } from './dropdown.constants'
import { DropdownChevron } from './DropdownChevron'

interface MultiSelectDropdownProps {
  label: string
  /** Optional panel heading. */
  title?: string
  options: readonly { value: string; label: string }[]
  selected: string[]
  onApply: (values: string[]) => void
}

/**
 * Custom multi-select filter dropdown: a pill trigger opens a white panel of
 * checkboxes with Close / Apply actions. `onApply` commits the draft.
 */
export function MultiSelectDropdown({
  label,
  title,
  options,
  selected,
  onApply,
}: MultiSelectDropdownProps) {
  const { open, setOpen, ref } = useDropdown()
  const [draft, setDraft] = useState<string[]>(selected)

  const toggleOpen = () => {
    if (open) {
      setOpen(false)
    } else {
      setDraft(selected) // start from the committed selection
      setOpen(true)
    }
  }

  const toggleValue = (value: string) =>
    setDraft((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="true"
        className={DROPDOWN_TRIGGER_CLASS}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-brand-500 px-1.5 text-xs font-semibold text-white">
            {selected.length}
          </span>
        )}
        <DropdownChevron open={open} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-ink/15 bg-white p-4 shadow-lg">
          {title && (
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              {title}
            </p>
          )}
          <div className={`space-y-3 ${title ? 'mt-4' : ''}`}>
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={draft.includes(option.value)}
                  onChange={() => toggleValue(option.value)}
                  className="size-4 accent-brand-600"
                />
                {option.label}
              </label>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink/5"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft)
                setOpen(false)
              }}
              className="flex-1 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
