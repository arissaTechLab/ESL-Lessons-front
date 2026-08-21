import { http } from '@/service'
import type { Paginated } from '@/interface'
import type { Article } from '@/features/resources/types/article.types'

/** ---------- What the API actually sends ---------- */

interface ApiArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl: string | null
  authorName: string
  category: string
  section: 'how-to' | 'teaching-ideas'
  publishedAt: string | null
}

/** ---------- Mapping onto the shape the components already use ---------- */

/** `2026-08-01T…` → `August 1, 2026`, the format the cards display. */
const formatDate = (value: string | null): string =>
  value
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(value))
    : ''

export function toArticle(dto: ApiArticle): Article {
  return {
    id: dto.id,
    category: dto.category,
    title: dto.title,
    author: dto.authorName,
    date: formatDate(dto.publishedAt),
  }
}

/** ---------- The public article grids ---------- */

/** The grids show 2 rows × 4 cards. */
const GRID_SIZE = 8

export const articlesService = {
  bySection: (
    section: 'how-to' | 'teaching-ideas',
    signal?: AbortSignal,
  ) =>
    http
      .get<Paginated<ApiArticle>>('/articles', {
        params: { section, page: 1, limit: GRID_SIZE },
        signal,
      })
      .then((page) => page.items.map(toArticle)),
}
