import type { ApiErrorBody } from '@/interface'

/**
 * Every failed request throws this, so callers get one predictable shape
 * whether the backend answered with a validation array, a single message, or
 * the network never reached it at all.
 */
export class ApiError extends Error {
  readonly status: number
  /** Individual validation messages, when the backend sent a list. */
  readonly details: string[]

  constructor(status: number, message: string, details: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  /** True when the caller is unauthenticated or the session expired. */
  get isUnauthorized(): boolean {
    return this.status === 401
  }

  static fromBody(status: number, body: unknown): ApiError {
    const payload = body as Partial<ApiErrorBody> | null

    if (payload && Array.isArray(payload.message)) {
      return new ApiError(status, payload.message[0] ?? 'Request failed', payload.message)
    }

    if (payload && typeof payload.message === 'string') {
      return new ApiError(status, payload.message)
    }

    return new ApiError(status, `Request failed with status ${status}`)
  }
}
