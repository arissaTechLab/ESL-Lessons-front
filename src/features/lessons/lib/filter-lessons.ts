import { LEVEL_META } from '../data/levels'
import { FREE_LESSONS_TOPIC } from '../data/filters'
import type { Lesson } from '../types/lesson.types'
import type { LessonFiltersState } from '../components/LessonFilters'

export function sortLessons(lessons: readonly Lesson[], sort: string): Lesson[] {
  const sorted = [...lessons]
  if (sort === 'oldest') {
    sorted.sort((a, b) => a.dateAdded.localeCompare(b.dateAdded))
  } else if (sort === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    // 'recent' — newest first
    sorted.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
  }
  return sorted
}

/** Apply search + level/category/topic filters, then sort. */
export function filterLessons(
  lessons: readonly Lesson[],
  filters: LessonFiltersState,
): Lesson[] {
  const query = filters.search.trim().toLowerCase()
  const matched = lessons.filter((lesson) => {
    const matchesLevel =
      filters.levels.length === 0 ||
      filters.levels.some((cefr) => LEVEL_META[lesson.level].tags.includes(cefr))
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(lesson.category)
    const matchesTopic =
      filters.topics.length === 0 ||
      filters.topics.some((topic) =>
        topic === FREE_LESSONS_TOPIC ? lesson.isFree : lesson.topic === topic,
      )
    const matchesQuery =
      query === '' ||
      lesson.title.toLowerCase().includes(query) ||
      lesson.topic.toLowerCase().includes(query) ||
      lesson.category.toLowerCase().includes(query)
    return matchesLevel && matchesCategory && matchesTopic && matchesQuery
  })
  return sortLessons(matched, filters.sort)
}
