import type { InputHTMLAttributes } from 'react'

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Doubles as the visible placeholder and the accessible label. */
  label: string
}

/** Styled text input used across the auth forms. */
export function AuthTextField({ label, ...props }: AuthTextFieldProps) {
  return (
    <input
      aria-label={label}
      placeholder={label}
      className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      {...props}
    />
  )
}
