import { http } from '@/service'
import type { Paginated } from '@/interface'
import type { BlogPost } from '@/features/blog/types/blog.types'

/** ---------- What the API actually sends ---------- */

export interface ApiArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string | null
  authorName: string
  category: string
  section: 'how-to' | 'teaching-ideas'
  status: 'published' | 'draft'
  publishedAt: string | null
}

export interface ArticleFilters {
  section?: 'how-to' | 'teaching-ideas'
  page?: number
  limit?: number
}

/** ---------- Mapping onto the shape the components already use ---------- */

/** `2026-08-01T…` → `2026-08-01`, which is what the cards format and sort on. */
const toIsoDate = (value: string | null): string =>
  value ? (value.split('T')[0] ?? '') : ''

export function toBlogPost(dto: ApiArticle): BlogPost {
  return {
    id: dto.id,
    title: dto.title,
    text: dto.excerpt,
    status: dto.status,
    date: toIsoDate(dto.publishedAt),
  }
}

/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY for display. */
export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** ---------- The public articles feed ---------- */

export const blogService = {
  list: (filters: ArticleFilters = {}, signal?: AbortSignal) =>
    http
      .get<Paginated<ApiArticle>>('/articles', {
        params: { ...filters },
        signal,
      })
      .then((page) => ({ ...page, items: page.items.map(toBlogPost) })),
}
