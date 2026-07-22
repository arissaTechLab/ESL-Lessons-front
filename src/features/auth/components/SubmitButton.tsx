import type { ReactNode } from 'react'

/**
 * Full-width auth submit button. Uses the brand's dark-green treatment but
 * (unlike the site-wide {@link Button}) is sentence-case per the auth design.
 */
export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-cream transition hover:bg-accent-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  )
}
