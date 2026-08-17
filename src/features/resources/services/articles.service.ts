import { http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  Article,
  ArticleDetail,
  ArticleSection,
} from '@/features/resources/types/article.types'

export const articlesService = {
  list: (
    params: { section?: ArticleSection; page?: number; limit?: number } = {},
    signal?: AbortSignal,
  ) => http.get<Paginated<Article>>('/articles', { params: { ...params }, signal }),

  bySlug: (slug: string, signal?: AbortSignal) =>
    http.get<ArticleDetail>(`/articles/${slug}`, { signal }),
}
