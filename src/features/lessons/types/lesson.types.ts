/**
 * The UI's lesson model. Field names are the ones the components already use;
 * `lessons.service` maps the API's richer payload onto this shape so the
 * screens did not have to change when the backend landed.
 */

/**
 * A level is identified by its slug. It used to be a closed union, but levels
 * are managed from admin Taxonomy now, so a new one must not break the type.
 * `LEVEL_META` still covers the seeded five as a styling fallback.
 */
export type LessonLevel = string

export type LessonStatus = 'published' | 'draft'

/** How a level is rendered — served by the API, falling back to LEVEL_META. */
export interface LessonLevelMeta {
  label: string
  /** CEFR tags shown inside the badge. */
  tags: readonly string[]
  /** Badge background color (hex). */
  bg: string
  /** Badge text color (hex). */
  text: string
}

export interface Lesson {
  id: string
  /** URL key — the detail route and every API call use this, not `id`. */
  slug: string
  title: string
  level: LessonLevel
  /** Presentation for `level`, resolved server-side. */
  levelMeta: LessonLevelMeta
  category: string
  /** Category slug — used to link a card to its category page. */
  categorySlug: string
  /** Small SVG mark for the category, managed from Taxonomy. */
  categoryIcon?: string
  topic: string
  /** ISO date (YYYY-MM-DD) — used for display and sorting. */
  dateAdded: string
  /** Free vs paid access (no credits). */
  isFree: boolean
  /** True when the viewer may not open the paid resources. */
  isLocked: boolean
  /** Part of a multi-lesson series (shows the series icon). */
  isSeries: boolean
  /** Publication state (admin). */
  status: LessonStatus
  /** Thumbnail image. Falls back to a placeholder when absent. */
  image?: string
  /** Reference code (e.g. "POD.01") — used on Grammar lessons. */
  reference?: string
}

/** Resource links — absent while a paid lesson is locked for the viewer. */
export interface LessonResources {
  googleSlidesUrl: string | null
  pdfPlanUrl: string | null
  videoUrl: string | null
  spotifyUrl: string | null
}

export interface LessonDetail extends Lesson {
  description: string
  objectives: string
  summary: string
  previewUrl: string | null
  resources: LessonResources | null
}

/** A category tile on "All Lessons: Categories" and its landing page. */
export interface LessonCategory {
  id: string
  slug: string
  title: string
  /** Display-only CEFR range, e.g. "B2 – C1". */
  levels: string
  image: string
  icon: string
  subtitle: string
  lessonCount?: number
}

/** A visitor comment under a lesson. */
export interface LessonComment {
  id: string
  body: string
  createdAt: string
  author: { id: string; fullName: string; initials: string }
}

/** Query accepted by the public catalogue endpoint. */
export interface LessonFilters {
  q?: string
  /** CEFR codes (A1..C1) or level slugs — the API accepts both. */
  levels?: string[]
  categories?: string[]
  topics?: string[]
  access?: 'free' | 'paid'
  sort?: 'newest' | 'oldest' | 'title-asc'
  page?: number
  limit?: number
}
