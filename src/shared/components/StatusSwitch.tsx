interface StatusSwitchProps {
  /** True when the row is published. */
  isOn: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  labelOn?: string
  labelOff?: string
}

/** Published/Draft toggle used directly inside the admin tables. */
export function StatusSwitch({
  isOn,
  onChange,
  disabled = false,
  labelOn = 'Published',
  labelOff = 'Draft',
}: StatusSwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span className="sr-only">{isOn ? labelOn : labelOff}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={() => onChange(!isOn)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition disabled:opacity-50 ${
          isOn ? 'bg-accent-600' : 'bg-ink/20'
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
            isOn ? 'left-4.5' : 'left-0.5'
          }`}
        />
      </button>
      <span className="text-xs font-medium text-ink-soft">
        {isOn ? labelOn : labelOff}
      </span>
    </label>
  )
}
