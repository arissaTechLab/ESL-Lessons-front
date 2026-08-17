import { ApiError, getAccessToken, http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  AdminLesson,
  AdminLessonFilters,
  AdminLessonPayload,
  LessonStatus,
  UploadKind,
  UploadResult,
} from '@/features/admin-lessons/types/admin-lesson.types'

// Mirrors the base URL of the shared client — uploads are the one multipart
// endpoint `http` (JSON-only) cannot send, so it gets its own fetch below.
const UPLOADS_URL = `${(
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
).replace(/\/+$/, '')}/uploads`

export const adminLessonsService = {
  list: (filters: AdminLessonFilters = {}, signal?: AbortSignal) =>
    http.get<Paginated<AdminLesson>>('/admin/lessons', {
      params: { ...filters },
      signal,
    }),

  get: (id: string, signal?: AbortSignal) =>
    http.get<AdminLesson>(`/admin/lessons/${id}`, { signal }),

  create: (dto: AdminLessonPayload) =>
    http.post<AdminLesson>('/admin/lessons', dto),

  update: (id: string, dto: Partial<AdminLessonPayload>) =>
    http.patch<AdminLesson>(`/admin/lessons/${id}`, dto),

  /** The table's Published/Draft switch. */
  setStatus: (id: string, status: LessonStatus) =>
    http.patch<AdminLesson>(`/admin/lessons/${id}/status`, { status }),

  remove: (id: string) => http.delete<void>(`/admin/lessons/${id}`),

  /** Multipart upload — same base URL and bearer token as the shared client. */
  upload: async (file: File, kind: UploadKind): Promise<UploadResult> => {
    const body = new FormData()
    body.append('file', file)

    const headers: Record<string, string> = {}
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`

    let response: Response
    try {
      response = await fetch(`${UPLOADS_URL}?kind=${kind}`, {
        method: 'POST',
        headers,
        body,
      })
    } catch {
      throw new ApiError(0, 'Could not reach the server. Is the API running?')
    }

    const payload: unknown = await response.json().catch(() => null)
    if (!response.ok) throw ApiError.fromBody(response.status, payload)

    return payload as UploadResult
  },
}
