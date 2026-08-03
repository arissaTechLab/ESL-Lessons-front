import type { InputHTMLAttributes } from 'react'

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Doubles as the visible placeholder and the accessible label. */
  label: string
  /** Validation message — shows a red border + text when set. */
  error?: string
}

/** Styled text input used across the auth forms. */
export function AuthTextField({ label, error, ...props }: AuthTextFieldProps) {
  return (
    <div>
      <input
        aria-label={label}
        aria-invalid={error ? true : undefined}
        placeholder={label}
        className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-ink transition placeholder:text-ink-muted focus:outline-none focus:ring-1 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
            : 'border-ink/15 focus:border-brand-500 focus:ring-brand-500'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
