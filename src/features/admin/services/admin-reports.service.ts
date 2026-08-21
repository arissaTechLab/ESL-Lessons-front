import { ApiError, getAccessToken, http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  Client,
  ClientStatus,
  SubscriptionPlan,
} from '@/features/clients'
import type { Transaction, TransactionStatus } from '@/features/revenue'

/** Only used by the multipart upload — every JSON call goes through `http`. */
const BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
).replace(/\/+$/, '')

/** ---------- What the API actually sends ---------- */

type ArticleSection = 'how-to' | 'teaching-ideas'
type PublishStatus = 'published' | 'draft'

interface ApiArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string | null
  authorName: string
  category: string
  section: ArticleSection
  status: PublishStatus
  publishedAt: string | null
  createdAt: string
}

interface ApiClientRow {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  registeredAt: string
  plan: SubscriptionPlan | null
  status: ClientStatus
  renewsAt: string | null
}

interface ApiTransaction {
  id: string
  userId: string
  user: { id: string; name: string; email: string } | null
  plan: SubscriptionPlan
  amount: number
  currency: string
  status: TransactionStatus
  reference: string | null
  paidAt: string | null
  createdAt: string
}

/** ---------- The shapes the admin screens consume ---------- */

export interface AdminArticle {
  id: string
  title: string
  /** Short teaser shown in the table under the title. */
  excerpt: string
  /** Full body edited in the form. */
  content: string
  imageUrl: string | null
  status: PublishStatus
  /** ISO date (YYYY-MM-DD) — publish date, falling back to creation. */
  date: string
}

export interface ArticleFilters {
  q?: string
  status?: PublishStatus
  section?: ArticleSection
  page?: number
  limit?: number
}

/** What the blog form collects — the service fills in the API-only fields. */
export interface ArticleInput {
  title: string
  content: string
  status: PublishStatus
  imageUrl?: string
}

export interface ClientFilters {
  q?: string
  plan?: SubscriptionPlan
  status?: ClientStatus
  page?: number
  limit?: number
}

export interface ClientsSummary {
  totalClients: number
  activeSubscriptions: number
  freeAccounts: number
}

export interface ClientsPage extends Paginated<Client> {
  summary: ClientsSummary
}

export interface RevenueOverview {
  metrics: {
    totalRevenue: number
    revenueThisMonth: number
    activeSubscriptions: number
    mrr: number
  }
  /** Last 12 months, oldest → newest. */
  chart: { month: string; label: string; revenue: number }[]
  paypal: { connected: boolean; accountEmail: string | null; mode: string }
}

export interface TransactionFilters {
  status?: TransactionStatus
  plan?: SubscriptionPlan
  page?: number
  limit?: number
}

export interface UploadedFile {
  url: string
  filename: string
  size: number
  mimeType: string
}

/** ---------- Mapping onto the shape the components already use ---------- */

/** `2026-08-17T…` → `2026-08-17`, which is what the tables format. */
const toIsoDate = (value: string | null): string =>
  value ? (value.split('T')[0] ?? '') : ''

function toAdminArticle(dto: ApiArticle): AdminArticle {
  return {
    id: dto.id,
    title: dto.title,
    excerpt: dto.excerpt,
    content: dto.content,
    imageUrl: dto.imageUrl,
    status: dto.status,
    date: toIsoDate(dto.publishedAt ?? dto.createdAt),
  }
}

function toClient(dto: ApiClientRow): Client {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: dto.fullName,
    email: dto.email,
    registeredAt: toIsoDate(dto.registeredAt),
    plan: dto.plan,
    status: dto.status,
    renewsAt: dto.renewsAt ? toIsoDate(dto.renewsAt) : null,
  }
}

function toTransaction(dto: ApiTransaction): Transaction {
  return {
    id: dto.id,
    userId: dto.userId,
    user: dto.user,
    plan: dto.plan,
    amount: dto.amount,
    currency: dto.currency,
    status: dto.status,
    reference: dto.reference,
    paidAt: dto.paidAt ? toIsoDate(dto.paidAt) : null,
  }
}

/** The blog form has one body field, so the card teaser is derived from it. */
function excerptFrom(content: string): string {
  const firstLine = content.split('\n').find((line) => line.trim() !== '') ?? ''
  return firstLine.length > 200 ? `${firstLine.slice(0, 197)}…` : firstLine
}

/** ---------- Admin blog, clients & revenue ---------- */

export const adminReportsService = {
  articles: (filters: ArticleFilters = {}, signal?: AbortSignal) =>
    http
      .get<Paginated<ApiArticle>>('/admin/articles', {
        params: {
          section: filters.section,
          page: filters.page,
          limit: filters.limit,
        },
        signal,
      })
      .then((page) => {
        // The API has no `q`/`status` filters (it 400s on unknown params), so
        // narrow the returned page here to honour the same call signature.
        let items = page.items.map(toAdminArticle)
        const query = filters.q?.trim().toLowerCase()
        if (query) {
          items = items.filter((a) => a.title.toLowerCase().includes(query))
        }
        if (filters.status) {
          items = items.filter((a) => a.status === filters.status)
        }
        return { ...page, items }
      }),

  /** There is no single-article admin endpoint — walk the paginated list. */
  article: async (id: string, signal?: AbortSignal): Promise<AdminArticle> => {
    for (let page = 1; ; page += 1) {
      const result = await http.get<Paginated<ApiArticle>>('/admin/articles', {
        params: { page, limit: 100 },
        signal,
      })
      const match = result.items.find((article) => article.id === id)
      if (match) return toAdminArticle(match)
      if (page >= result.pages) throw new ApiError(404, 'Post not found.')
    }
  },

  createArticle: (input: ArticleInput) =>
    http
      .post<ApiArticle>('/admin/articles', {
        title: input.title,
        excerpt: excerptFrom(input.content),
        content: input.content,
        // The form has no category/section controls — sensible defaults.
        category: 'Teaching ideas',
        section: 'teaching-ideas' satisfies ArticleSection,
        status: input.status,
        ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
      })
      .then(toAdminArticle),

  updateArticle: (id: string, input: Partial<ArticleInput>) =>
    http
      .patch<ApiArticle>(`/admin/articles/${id}`, {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      })
      .then(toAdminArticle),

  setArticleStatus: (id: string, status: PublishStatus) =>
    http
      .patch<ApiArticle>(`/admin/articles/${id}/status`, { status })
      .then(toAdminArticle),

  deleteArticle: (id: string) => http.delete<void>(`/admin/articles/${id}`),

  /**
   * Multipart upload for cover images. The shared `http` client only speaks
   * JSON, so this one call builds its own `fetch` with the bearer token.
   */
  uploadImage: async (file: File): Promise<UploadedFile> => {
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
    return payload as UploadedFile
  },

  clients: (filters: ClientFilters = {}, signal?: AbortSignal) =>
    http
      .get<
        Paginated<ApiClientRow> & { summary: ClientsSummary }
      >('/admin/clients', {
        params: {
          q: filters.q,
          plan: filters.plan,
          status: filters.status,
          page: filters.page,
          limit: filters.limit,
        },
        signal,
      })
      .then(
        (page): ClientsPage => ({ ...page, items: page.items.map(toClient) }),
      ),

  revenue: (signal?: AbortSignal) =>
    http.get<RevenueOverview>('/admin/revenue', { signal }),

  transactions: (filters: TransactionFilters = {}, signal?: AbortSignal) =>
    http
      .get<Paginated<ApiTransaction>>('/admin/revenue/transactions', {
        params: {
          status: filters.status,
          plan: filters.plan,
          page: filters.page,
          limit: filters.limit,
        },
        signal,
      })
      .then((page) => ({ ...page, items: page.items.map(toTransaction) })),

  connectPaypal: (accountEmail: string) =>
    http.post<{ connected: boolean }>('/admin/paypal/connect', {
      accountEmail,
    }),

  disconnectPaypal: () => http.delete<void>('/admin/paypal/connect'),
}
