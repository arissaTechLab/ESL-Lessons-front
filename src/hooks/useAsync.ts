import { useEffect, useState } from 'react'
import { ApiError } from '@/service'

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

const INITIAL = { data: null, isLoading: true, error: null } as const

/**
 * Runs an async loader on mount and whenever `deps` change, exposing the three
 * states every data-driven section needs. Aborts in-flight requests on unmount
 * so a fast navigation never sets state on a dead component.
 *
 * `deps` must be primitives — they are joined into a cache key.
 */
export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[] = [],
): AsyncState<T> {
  const depsKey = deps.map(String).join('|')

  const [state, setState] = useState<AsyncState<T>>(INITIAL)
  const [renderedKey, setRenderedKey] = useState(depsKey)

  // Reset during render rather than in an effect: the new deps make the old
  // data stale immediately, so showing it for one frame would be wrong.
  if (renderedKey !== depsKey) {
    setRenderedKey(depsKey)
    setState(INITIAL)
  }

  useEffect(() => {
    const controller = new AbortController()

    loader(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setState({ data, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          data: null,
          isLoading: false,
          error:
            error instanceof ApiError
              ? error.message
              : 'Something went wrong. Please try again.',
        })
      })

    return () => controller.abort()
    // `loader` is an inline closure at every call site; `depsKey` is what
    // actually determines when a refetch is needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey])

  return state
}
