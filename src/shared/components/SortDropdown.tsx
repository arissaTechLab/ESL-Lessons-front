import { useDropdown } from '@/shared/hooks/useDropdown'
import { DROPDOWN_TRIGGER_CLASS } from './dropdown.constants'
import { DropdownChevron } from './DropdownChevron'

function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
    </svg>
  )
}

interface SortDropdownProps {
  value: string
  options: readonly { value: string; label: string }[]
  onChange: (value: string) => void
  /** Fixed trigger label (e.g. "Sort By"); omit to show the current option. */
  label?: string
}

/** Custom single-select dropdown; options apply immediately on click. */
export function SortDropdown({
  value,
  options,
  onChange,
  label,
}: SortDropdownProps) {
  const { open, setOpen, ref } = useDropdown()
  const current = options.find((option) => option.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={DROPDOWN_TRIGGER_CLASS}
      >
        {label ? (
          <>
            <SortIcon />
            {label}
          </>
        ) : (
          <>
            {current?.label ?? 'Sort'}
            <DropdownChevron open={open} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-ink/15 bg-white p-1.5 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                option.value === value
                  ? 'bg-accent-100 font-semibold text-ink'
                  : 'text-ink-soft hover:bg-ink/5'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
