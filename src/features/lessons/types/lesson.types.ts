export type LessonLevel =
  | 'beginner-elementary'
  | 'intermediate'
  | 'intermediate-upper-intermediate'
  | 'upper-intermediate-advanced'
  | 'multi-level'

export type LessonStatus = 'published' | 'draft'

export interface Lesson {
  id: string
  title: string
  level: LessonLevel
  category: string
  topic: string
  /** ISO date (YYYY-MM-DD) — used for display and sorting. */
  dateAdded: string
  /** Free vs paid access (no credits). */
  isFree: boolean
  /** Part of a multi-lesson series (shows the series icon). */
  isSeries: boolean
  /** Publication state (admin). */
  status: LessonStatus
}
