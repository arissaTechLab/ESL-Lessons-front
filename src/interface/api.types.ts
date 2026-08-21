/**
 * Transport-level shapes shared by every endpoint. Domain types live with the
 * feature that owns them (`features/<domain>/types`).
 */

/** Envelope returned by every paginated endpoint. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

/** Error body produced by the backend's global exception filter. */
export interface ApiErrorBody {
  statusCode: number
  message: string | string[]
  error: string
  path: string
  timestamp: string
}
