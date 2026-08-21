import { ApiError, getAccessToken, http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  Lesson,
  LessonStatus,
} from '@/features/lessons/types/lesson.types'

/** ---------- What the API actually sends ---------- */

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  iconUrl: string | null
  levelsRange: string | null
  order: number
  isActive: boolean
}

export interface AdminLevel {
  id: string
  name: string
  slug: string
  cefr: string[]
  color: string
  textColor: string
  order: number
}

export interface AdminTopic {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
}

export interface AdminTaxonomy {
  categories: AdminCategory[]
  levels: AdminLevel[]
  topics: AdminTopic[]
}

/** Full lesson record from `/admin/lessons` — taxonomy refs come populated. */
export interface AdminLesson {
  id: string
  slug: string
  title: string
  reference: string | null
  access: 'free' | 'paid'
  status: LessonStatus
  description: string
  objectives: string
  summary: string
  googleSlidesUrl: string | null
  pdfPlanUrl: string | null
  videoUrl: string | null
  spotifyUrl: string | null
  previewUrl: string | null
  imageUrl: string | null
  series: { name: string; order: number } | null
  category: AdminCategory
  level: AdminLevel
  topic: AdminTopic
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  downloadCounts: { slides: number; pdf: number }
}

/** Body for create/update — taxonomy fields are ids, not slugs. */
export interface AdminLessonDto {
  title?: string
  category?: string
  level?: string
  topic?: string
  access?: 'free' | 'paid'
  status?: LessonStatus
  reference?: string | null
  description?: string
  objectives?: string
  summary?: string
  googleSlidesUrl?: string | null
  videoUrl?: string | null
  spotifyUrl?: string | null
  pdfPlanUrl?: string | null
  imageUrl?: string | null
  previewUrl?: string | null
}

export interface AdminLessonsQuery {
  q?: string
  status?: LessonStatus
  page?: number
  limit?: number
}

export interface AdminDashboard {
  metrics: {
    slidesDownloads: number
    pdfDownloads: number
    activeSubscriptions: number
    totalClients: number
    totalRevenue: number
    /** % vs previous month. */
    revenueGrowthThisMonth: number
  }
  /** Last 6 months, zero-filled. */
  downloadsChart: { month: string; label: string; slides: number; pdf: number }[]
  /** Top 5. */
  topLessons: {
    id: string
    title: string
    slug: string
    downloads: number
    percentage: number
  }[]
}

export interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}

/** ---------- Mapping onto the shape the components already use ---------- */

/** `2026-08-17T…` → `2026-08-17`, which is what the table formats. */
const toIsoDate = (value: string | null): string =>
  value ? (value.split('T')[0] ?? '') : ''

/** Admin record → the `Lesson` shape the table renders (drafts fall back to `createdAt`). */
export function toLessonRow(dto: AdminLesson): Lesson {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    level: dto.level.slug,
    levelMeta: {
      label: dto.level.name,
      tags: dto.level.cefr,
      bg: dto.level.color,
      text: dto.level.textColor,
    },
    category: dto.category.name,
    categorySlug: dto.category.slug,
    categoryIcon: dto.category.iconUrl ?? undefined,
    topic: dto.topic.name,
    dateAdded: toIsoDate(dto.publishedAt ?? dto.createdAt),
    isFree: dto.access === 'free',
    isLocked: false,
    isSeries: dto.series !== null,
    status: dto.status,
    image: dto.imageUrl ?? undefined,
    reference: dto.reference ?? undefined,
  }
}

/** ---------- Uploads (multipart — outside the JSON http client) ---------- */

const BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
).replace(/\/+$/, '')

/**
 * The shared http client only speaks JSON, so file uploads go through a small
 * dedicated fetch that leaves Content-Type to the browser (FormData boundary).
 */
async function upload(file: File, kind: 'image' | 'pdf'): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)

  const headers: Record<string, string> = {}
  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${BASE_URL}/uploads?kind=${kind}`, {
      method: 'POST',
      headers,
      body: form,
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Is the API running?')
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw ApiError.fromBody(response.status, payload)

  return payload as UploadResult
}

/** ---------- The admin content API ---------- */

export const adminService = {
  dashboard: (signal?: AbortSignal) =>
    http.get<AdminDashboard>('/admin/dashboard', { signal }),

  /** Paginated list, drafts included. */
  lessons: (query: AdminLessonsQuery = {}, signal?: AbortSignal) =>
    http
      .get<Paginated<AdminLesson>>('/admin/lessons', {
        params: { ...query },
        signal,
      })
      .then((page) => ({ ...page, items: page.items.map(toLessonRow) })),

  lesson: (id: string, signal?: AbortSignal) =>
    http.get<AdminLesson>(`/admin/lessons/${id}`, { signal }),

  createLesson: (dto: AdminLessonDto) =>
    http.post<AdminLesson>('/admin/lessons', dto),

  updateLesson: (id: string, dto: AdminLessonDto) =>
    http.patch<AdminLesson>(`/admin/lessons/${id}`, dto),

  setLessonStatus: (id: string, status: LessonStatus) =>
    http.patch<AdminLesson>(`/admin/lessons/${id}/status`, { status }),

  deleteLesson: (id: string) => http.delete<void>(`/admin/lessons/${id}`),

  taxonomy: (signal?: AbortSignal) =>
    http.get<AdminTaxonomy>('/taxonomy', { signal }),

  createCategory: (dto: { name: string; description?: string }) =>
    http.post<AdminCategory>('/admin/taxonomy/categories', dto),

  /** `force` skips the in-use guard — the plain call 409s while lessons reference it. */
  deleteCategory: (id: string, force = false) =>
    http.delete<void>(`/admin/taxonomy/categories/${id}`, {
      params: { force: force ? 'true' : undefined },
    }),

  createTopic: (dto: { name: string }) =>
    http.post<AdminTopic>('/admin/taxonomy/topics', dto),

  deleteTopic: (id: string, force = false) =>
    http.delete<void>(`/admin/taxonomy/topics/${id}`, {
      params: { force: force ? 'true' : undefined },
    }),

  createLevel: (dto: {
    name: string
    cefr: string[]
    color: string
    textColor?: string
  }) => http.post<AdminLevel>('/admin/taxonomy/levels', dto),

  deleteLevel: (id: string, force = false) =>
    http.delete<void>(`/admin/taxonomy/levels/${id}`, {
      params: { force: force ? 'true' : undefined },
    }),

  upload,
}
