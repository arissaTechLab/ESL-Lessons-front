import type { Category, Level, Topic } from '@/features/admin-taxonomy'
import type { LessonAccess } from '@/features/lessons'

export type LessonStatus = 'published' | 'draft'

export interface LessonSeries {
  name: string
  order: number
}

/** Full admin record — taxonomy refs come back populated, links never gated. */
export interface AdminLesson {
  id: string
  slug: string
  title: string
  access: LessonAccess
  status: LessonStatus
  description: string
  objectives: string
  summary: string
  googleSlidesUrl: string | null
  videoUrl: string | null
  spotifyUrl: string | null
  pdfPlanUrl: string | null
  imageUrl: string | null
  previewUrl: string | null
  series: LessonSeries | null
  category: Category
  level: Level
  topic: Topic
  publishedAt: string | null
  downloadCounts: { slides: number; pdf: number }
  createdAt: string
  updatedAt: string
}

/** Body for create/update — taxonomy fields are ids; `null` clears a URL. */
export interface AdminLessonPayload {
  title: string
  category: string
  level: string
  topic: string
  access: LessonAccess
  status: LessonStatus
  description?: string
  objectives?: string
  summary?: string
  googleSlidesUrl?: string | null
  videoUrl?: string | null
  spotifyUrl?: string | null
  pdfPlanUrl?: string | null
  imageUrl?: string | null
}

/** Query accepted by `GET /admin/lessons` (drafts included). */
export interface AdminLessonFilters {
  q?: string
  status?: LessonStatus
  page?: number
  limit?: number
}

export type UploadKind = 'image' | 'pdf'

/** Response of `POST /uploads`. */
export interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}
