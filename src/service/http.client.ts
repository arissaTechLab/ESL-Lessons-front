import { ApiError } from '@/service/api.error'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/service/token.storage'

/**
 * Where the API lives. `VITE_API_URL` wins when it is set, so any environment
 * can point somewhere else without a code change. Without it we fall back to
 * the local API while developing and to the shared test server once built —
 * that way the Netlify deploy works with no environment variables configured.
 */
const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api'
  : 'https://esl.arissa.io/api'

const BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
  /\/+$/,
  '',
)

interface RequestOptions {
  /** Query string parameters. Arrays are repeated: `?levels=b1&levels=b2`. */
  params?: Record<string, string | number | boolean | string[] | undefined | null>
  /** JSON body. Omit for GET/DELETE. */
  body?: unknown
  /** Send the bearer token even on endpoints that also work anonymously. */
  auth?: boolean
  signal?: AbortSignal
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`)

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') continue

    if (Array.isArray(value)) {
      for (const entry of value) url.searchParams.append(key, entry)
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

/**
 * Exchanges the refresh token for a new pair. Kept module-level (rather than
 * per-call) so several concurrent 401s share one refresh instead of racing.
 */
let refreshInFlight: Promise<boolean> | null = null

async function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  refreshInFlight ??= (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        clearTokens()
        return false
      }

      const tokens = (await response.json()) as {
        accessToken: string
        refreshToken: string
      }
      setTokens(tokens)
      return true
    } catch {
      clearTokens()
      return false
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

async function send<T>(
  method: string,
  path: string,
  options: RequestOptions,
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.params), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'Could not reach the server. Is the API running?')
  }

  // One transparent retry after refreshing an expired access token.
  if (response.status === 401 && !isRetry && getRefreshToken()) {
    if (await refreshSession()) {
      return send<T>(method, path, options, true)
    }
  }

  if (response.status === 204) return undefined as T

  const payload = await response.json().catch(() => null)

  if (!response.ok) throw ApiError.fromBody(response.status, payload)

  return payload as T
}

/** Thin typed wrapper over `fetch` — the only place the API base URL is known. */
export const http = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    send<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    send<T>('POST', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    send<T>('PATCH', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    send<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options: RequestOptions = {}) =>
    send<T>('DELETE', path, options),
}
