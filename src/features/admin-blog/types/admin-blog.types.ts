import type { ArticleSection } from '@/features/resources'

export type { ArticleSection }

export type ArticleStatus = 'published' | 'draft'

/** Full admin view of an article — includes drafts and the raw content. */
export interface AdminArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string | null
  authorName: string
  category: string
  section: ArticleSection
  status: ArticleStatus
  publishedAt: string | null
}

/** Query accepted by the admin blog table. */
export interface AdminArticleFilters {
  q?: string
  status?: ArticleStatus
  section?: ArticleSection
  page?: number
  limit?: number
}

/** Body sent on create / update. */
export interface ArticleDto {
  title: string
  excerpt: string
  content: string
  imageUrl?: string | null
  category: string
  section: ArticleSection
  status: ArticleStatus
}

/** What `POST /uploads` answers with. */
export interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}
