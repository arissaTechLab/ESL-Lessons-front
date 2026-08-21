import type { ReactNode } from 'react'

interface SubmitButtonProps {
  children: ReactNode
  /** Disables the button and swaps the label while a request is in flight. */
  isLoading?: boolean
  loadingLabel?: string
}

/**
 * Full-width auth submit button. Uses the brand's dark-green treatment but
 * (unlike the site-wide {@link Button}) is sentence-case per the auth design.
 */
export function SubmitButton({
  children,
  isLoading = false,
  loadingLabel = 'Please wait…',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-cream transition hover:bg-accent-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? loadingLabel : children}
    </button>
  )
}
