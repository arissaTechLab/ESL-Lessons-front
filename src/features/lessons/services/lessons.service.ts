import { http } from '@/service'
import type { Paginated } from '@/interface'
import type {
  Lesson,
  LessonCategory,
  LessonComment,
  LessonDetail,
  LessonFilters,
} from '@/features/lessons/types/lesson.types'

/** ---------- What the API actually sends ---------- */

interface ApiTaxonomyRef {
  id: string
  name: string
  slug: string
}

interface ApiLevel extends ApiTaxonomyRef {
  cefr: string[]
  color: string
  textColor: string
}

interface ApiCategory extends ApiTaxonomyRef {
  description: string | null
  imageUrl: string | null
  iconUrl: string | null
  levelsRange: string | null
  order: number
}

interface ApiLessonCard {
  id: string
  slug: string
  title: string
  imageUrl: string | null
  access: 'free' | 'paid'
  isLocked: boolean
  status?: 'published' | 'draft'
  reference: string | null
  series: { name: string; order: number } | null
  level: ApiLevel
  category: ApiCategory | ApiTaxonomyRef
  topic: ApiTaxonomyRef
  publishedAt: string | null
}

interface ApiLessonDetail extends ApiLessonCard {
  description: string
  objectives: string
  summary: string
  previewUrl: string | null
  resources: LessonDetail['resources']
}

export interface ApiTaxonomy {
  categories: ApiCategory[]
  levels: ApiLevel[]
  topics: ApiTaxonomyRef[]
}

/** ---------- Mapping onto the shape the components already use ---------- */

/** `2026-08-17T…` → `2026-08-17`, which is what the cards sort and format on. */
const toIsoDate = (value: string | null): string =>
  value ? (value.split('T')[0] ?? '') : ''

export function toLesson(dto: ApiLessonCard): Lesson {
  const category = dto.category as ApiCategory
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
    categoryIcon: category.iconUrl ?? undefined,
    topic: dto.topic.name,
    dateAdded: toIsoDate(dto.publishedAt),
    isFree: dto.access === 'free',
    isLocked: dto.isLocked,
    isSeries: dto.series !== null,
    status: dto.status ?? 'published',
    image: dto.imageUrl ?? undefined,
    reference: dto.reference ?? undefined,
  }
}

export function toLessonDetail(dto: ApiLessonDetail): LessonDetail {
  return {
    ...toLesson(dto),
    description: dto.description,
    objectives: dto.objectives,
    summary: dto.summary,
    previewUrl: dto.previewUrl,
    resources: dto.resources,
  }
}

export function toCategory(dto: ApiCategory, lessonCount?: number): LessonCategory {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.name,
    levels: dto.levelsRange ?? '',
    image: dto.imageUrl ?? '',
    icon: dto.iconUrl ?? '',
    subtitle: dto.description ?? '',
    lessonCount,
  }
}

const toPage = (page: Paginated<ApiLessonCard>): Paginated<Lesson> => ({
  ...page,
  items: page.items.map(toLesson),
})

/** ---------- The public catalogue ---------- */

export const lessonsService = {
  list: (filters: LessonFilters = {}, signal?: AbortSignal) =>
    http
      .get<Paginated<ApiLessonCard>>('/lessons', { params: { ...filters }, signal })
      .then(toPage),

  bySlug: (slug: string, signal?: AbortSignal) =>
    http
      .get<ApiLessonDetail>(`/lessons/${slug}`, { signal })
      .then(toLessonDetail),

  similar: (slug: string, signal?: AbortSignal) =>
    http
      .get<ApiLessonCard[]>(`/lessons/${slug}/similar`, { signal })
      .then((items) => items.map(toLesson)),

  /** Free + most recent + the category tiles, in one call. */
  curated: (signal?: AbortSignal) =>
    http
      .get<{
        freeLessons: ApiLessonCard[]
        mostRecent: ApiLessonCard[]
        categories: (ApiCategory & { lessonCount: number })[]
      }>('/lessons/curated', { signal })
      .then((dto) => ({
        freeLessons: dto.freeLessons.map(toLesson),
        mostRecent: dto.mostRecent.map(toLesson),
        categories: dto.categories.map((c) => toCategory(c, c.lessonCount)),
      })),

  /** Filter sources — categories, levels and topics in one round trip. */
  taxonomy: (signal?: AbortSignal) =>
    http.get<ApiTaxonomy>('/taxonomy', { signal }),

  categories: (signal?: AbortSignal) =>
    http
      .get<ApiCategory[]>('/taxonomy/categories', { signal })
      .then((items) => items.map((c) => toCategory(c))),

  comments: (slug: string, page = 1, signal?: AbortSignal) =>
    http.get<Paginated<LessonComment>>(`/lessons/${slug}/comments`, {
      params: { page },
      signal,
    }),

  addComment: (slug: string, body: string) =>
    http.post<LessonComment>(`/lessons/${slug}/comments`, { body }),
}
