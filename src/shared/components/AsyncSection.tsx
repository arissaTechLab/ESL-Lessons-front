import type { ReactNode } from 'react'

interface AsyncSectionProps<T> {
  state: { data: T | null; isLoading: boolean; error: string | null }
  /** Rendered once data has arrived. */
  children: (data: T) => ReactNode
  /** Skeleton shown while loading — defaults to a neutral pulse. */
  skeleton?: ReactNode
  /** Shown when the request succeeded but there is nothing to display. */
  empty?: ReactNode
  /** Decides whether `data` counts as empty. Defaults to empty-array. */
  isEmpty?: (data: T) => boolean
}

function DefaultSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-xl border border-ink/10 bg-accent-100"
        />
      ))}
    </div>
  )
}

/**
 * Renders the loading / error / empty / ready states of a `useAsync` call in
 * one place, so every data-driven section behaves the same way.
 */
export function AsyncSection<T>({
  state,
  children,
  skeleton,
  empty,
  isEmpty,
}: AsyncSectionProps<T>) {
  if (state.isLoading) return <>{skeleton ?? <DefaultSkeleton />}</>

  if (state.error) {
    return (
      <p
        role="status"
        className="rounded-xl border border-ink/10 bg-cream px-4 py-6 text-center text-sm text-ink-soft"
      >
        {state.error}
      </p>
    )
  }

  if (state.data === null) return null

  const treatAsEmpty =
    isEmpty?.(state.data) ??
    (Array.isArray(state.data) && state.data.length === 0)

  if (treatAsEmpty) {
    return (
      <>
        {empty ?? (
          <p className="py-6 text-center text-sm text-ink-muted">
            Nothing here yet — check back soon.
          </p>
        )}
      </>
    )
  }

  return <>{children(state.data)}</>
}
