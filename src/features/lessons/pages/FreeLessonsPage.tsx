import { useMemo } from 'react'
import { LessonCollectionPage } from '@/features/lessons/components'
import { makePlaceholderLessons } from '@/features/lessons/data/placeholder-lessons'

export function FreeLessonsPage() {
  const lessons = useMemo(
    () =>
      makePlaceholderLessons('free', 8, {
        category: 'Free Lessons',
        allFree: true,
      }),
    [],
  )

  return (
    <LessonCollectionPage
      title="Free Lessons"
      subtitle="A handful of full lessons on the house — try one before you subscribe."
      lessons={lessons}
    />
  )
}
