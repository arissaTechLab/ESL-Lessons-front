/** CEFR codes used by the public level filter. */
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type LessonAccess = 'free' | 'paid'

export type LessonSort = 'newest' | 'oldest' | 'title-asc'

/** A taxonomy entry as embedded in a lesson card. */
export interface TaxonomyRef {
  id: string
  name: string
  slug: string
}

/** A level carries its own badge colour so cards render consistently. */
export interface LevelRef extends TaxonomyRef {
  cefr: CefrLevel[]
  color: string
  textColor: string
}

export interface LessonSeries {
  name: string
  order: number
}

/** What the API returns for every lesson tile across the site. */
export interface LessonCard {
  id: string
  slug: string
  title: string
  imageUrl: string | null
  access: LessonAccess
  /** True when the viewer may not open the paid resources. */
  isLocked: boolean
  series: LessonSeries | null
  level: LevelRef
  category: TaxonomyRef
  topic: TaxonomyRef
  publishedAt: string | null
}

/** Resource links — `null` for a locked lesson, never partially filled. */
export interface LessonResources {
  googleSlidesUrl: string | null
  pdfPlanUrl: string | null
  videoUrl: string | null
  spotifyUrl: string | null
}

export interface LessonDetail extends LessonCard {
  description: string
  objectives: string
  summary: string
  previewUrl: string | null
  resources: LessonResources | null
}

/** Query accepted by `GET /api/lessons`. */
export interface LessonFilters {
  q?: string
  levels?: string[]
  categories?: string[]
  topics?: string[]
  access?: LessonAccess
  sort?: LessonSort
  page?: number
  limit?: number
}

/** Sections rendered by All Lessons when no filter is applied. */
export interface CuratedLessons {
  freeLessons: LessonCard[]
  mostRecent: LessonCard[]
  categories: { id: string; name: string; slug: string; lessonCount: number }[]
}
