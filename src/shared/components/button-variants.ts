export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'sm' | 'md'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-60'

/** Color treatments. */
const VARIANTS: Record<ButtonVariant, string> = {
  // 🟠 Main call-to-action.
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-600 focus-visible:ring-brand-500',
  // 🟢 Dark-green solid (e.g. "Sign up").
  secondary:
    'bg-accent-700 text-cream shadow-sm hover:bg-accent-800 focus-visible:ring-accent-700',
  // ⚪ Outline / low-emphasis complement (e.g. "Log in").
  tertiary:
    'border border-ink/25 text-ink hover:bg-ink/5 focus-visible:ring-brand-500',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
}

/**
 * Compose the site-wide button classes. Use this on anything that isn't a
 * real `<button>` — anchors and React Router `<Link>`s that should look like
 * a button. Extra classes (layout margins, etc.) go in `className`.
 */
export function buttonVariants(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className = '',
) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim()
}
