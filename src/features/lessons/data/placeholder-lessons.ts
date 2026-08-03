import type { Lesson, LessonLevel } from '../types/lesson.types'

const LEVEL_CYCLE: readonly LessonLevel[] = [
  'beginner-elementary',
  'intermediate',
  'intermediate-upper-intermediate',
  'upper-intermediate-advanced',
  'multi-level',
]

const TOPIC_CYCLE: readonly string[] = [
  'Health & Wellness',
  'Human Interest',
  'Science & Technology',
  'Arts & Entertainment',
  'Business',
]

interface PlaceholderOptions {
  category: string
  /** When true, every generated lesson is free. */
  allFree?: boolean
}

/**
 * Generate placeholder lesson cards to showcase a collection layout. Levels
 * and topics rotate so the filters have something to act on.
 */
export function makePlaceholderLessons(
  idPrefix: string,
  count: number,
  { category, allFree = false }: PlaceholderOptions,
): Lesson[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i + 1}`,
    title: 'Lesson title goes here and needs two rows always',
    level: LEVEL_CYCLE[i % LEVEL_CYCLE.length] ?? 'intermediate',
    category,
    topic: TOPIC_CYCLE[i % TOPIC_CYCLE.length] ?? 'Business',
    dateAdded: `2025-05-${String((i % 28) + 1).padStart(2, '0')}`,
    isFree: allFree || i % 3 === 0,
    isSeries: i % 4 === 0,
    status: 'published',
  }))
}
