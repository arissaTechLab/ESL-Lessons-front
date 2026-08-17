import { http } from '@/service'
import type {
  Category,
  CreateCategoryPayload,
  CreateLevelPayload,
  CreateTopicPayload,
  Level,
  TaxonomySnapshot,
  Topic,
} from '@/features/admin-taxonomy/types/taxonomy.types'

/**
 * Taxonomy reads + admin mutations. `all()` is also the source of the
 * category / level / topic selects in the admin lesson form — options are
 * never hardcoded.
 *
 * Deletes answer 409 while lessons still reference the row; retry with
 * `force = true` to delete anyway (existing lessons keep their value).
 */
export const taxonomyService = {
  all: (signal?: AbortSignal) =>
    http.get<TaxonomySnapshot>('/taxonomy', { signal }),

  createCategory: (payload: CreateCategoryPayload) =>
    http.post<Category>('/admin/taxonomy/categories', payload),

  deleteCategory: (id: string, force = false) =>
    http.delete<void>(`/admin/taxonomy/categories/${id}`, {
      params: { force: force ? 'true' : undefined },
    }),

  createTopic: (payload: CreateTopicPayload) =>
    http.post<Topic>('/admin/taxonomy/topics', payload),

  deleteTopic: (id: string, force = false) =>
    http.delete<void>(`/admin/taxonomy/topics/${id}`, {
      params: { force: force ? 'true' : undefined },
    }),

  createLevel: (payload: CreateLevelPayload) =>
    http.post<Level>('/admin/taxonomy/levels', payload),

  deleteLevel: (id: string, force = false) =>
    http.delete<void>(`/admin/taxonomy/levels/${id}`, {
      params: { force: force ? 'true' : undefined },
    }),
}
