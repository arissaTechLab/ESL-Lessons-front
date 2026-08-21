import { LessonCollectionPage } from '@/features/lessons/components'

export function FreeLessonsPage() {
  return (
    <LessonCollectionPage
      title="Free Lessons"
      subtitle="A handful of full lessons on the house — try one before you subscribe."
      query={{ access: 'free' }}
    />
  )
}
