export type LessonLevel =
  | 'intermediate'
  | 'upper-intermediate-advanced'
  | 'multi-level'
  | 'intermediate-upper-intermediate'

export interface Lesson {
  id: string
  title: string
  level: LessonLevel
  category: string
  topic: string
  /** ISO date (YYYY-MM-DD) — used for display and sorting. */
  dateAdded: string
  isFree: boolean
  credits: number
  /** Part of a multi-lesson series (shows the series icon). */
  isSeries: boolean
}
