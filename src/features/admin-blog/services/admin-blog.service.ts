import { ApiError, getAccessToken, http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  AdminArticle,
  AdminArticleFilters,
  ArticleDto,
  ArticleStatus,
  UploadResult,
} from '@/features/admin-blog/types/admin-blog.types'

// Same resolution as http.client — uploads need raw fetch but the same host.
const BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
).replace(/\/+$/, '')

const DEFAULT_LIMIT = 10
/** Big enough to hold the whole catalogue when filtering client-side. */
const FETCH_ALL_LIMIT = 100

export const adminBlogService = {
  /**
   * The endpoint only understands `section/page/limit`; `q` and `status` are
   * applied here over one large page so the table can still search drafts.
   */
  list: async (
    filters: AdminArticleFilters = {},
    signal?: AbortSignal,
  ): Promise<Paginated<AdminArticle>> => {
    const { q, status, section, page = 1, limit = DEFAULT_LIMIT } = filters

    if (!q && !status) {
      return http.get<Paginated<AdminArticle>>('/admin/articles', {
        params: { section, page, limit },
        signal,
      })
    }

    const all = await http.get<Paginated<AdminArticle>>('/admin/articles', {
      params: { section, page: 1, limit: FETCH_ALL_LIMIT },
      signal,
    })

    const needle = (q ?? '').trim().toLowerCase()
    const items = all.items.filter(
      (article) =>
        (!status || article.status === status) &&
        (!needle ||
          article.title.toLowerCase().includes(needle) ||
          article.category.toLowerCase().includes(needle)),
    )

    const pages = Math.ceil(items.length / limit)
    const current = Math.min(Math.max(page, 1), Math.max(pages, 1))

    return {
      items: items.slice((current - 1) * limit, current * limit),
      total: items.length,
      page: current,
      limit,
      pages,
    }
  },

  /** There is no GET-by-id endpoint — walk the list until the row shows up. */
  byId: async (id: string, signal?: AbortSignal): Promise<AdminArticle> => {
    for (let page = 1; ; page += 1) {
      const result = await http.get<Paginated<AdminArticle>>(
        '/admin/articles',
        {
          params: { page, limit: FETCH_ALL_LIMIT },
          signal,
        },
      )

      const found = result.items.find((article) => article.id === id)
      if (found) return found
      if (page >= result.pages) throw new ApiError(404, 'Article not found.')
    }
  },

  create: (dto: ArticleDto) => http.post<AdminArticle>('/admin/articles', dto),

  update: (id: string, dto: Partial<ArticleDto>) =>
    http.patch<AdminArticle>(`/admin/articles/${id}`, dto),

  setStatus: (id: string, status: ArticleStatus) =>
    http.patch<AdminArticle>(`/admin/articles/${id}/status`, { status }),

  remove: (id: string) => http.delete<void>(`/admin/articles/${id}`),

  /** The shared client is JSON-only, so the multipart upload uses raw fetch. */
  upload: async (file: File): Promise<UploadResult> => {
    const body = new FormData()
    body.append('file', file)

    const headers: Record<string, string> = {}
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`

    let response: Response
    try {
      response = await fetch(`${BASE_URL}/uploads?kind=image`, {
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
