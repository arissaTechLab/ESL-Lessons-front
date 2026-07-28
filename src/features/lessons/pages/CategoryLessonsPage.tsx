import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import { LessonCollectionPage } from '@/features/lessons/components'
import { LESSON_CATEGORIES } from '@/features/lessons/data/categories'
import { makePlaceholderLessons } from '@/features/lessons/data/placeholder-lessons'

export function CategoryLessonsPage() {
  const { slug } = useParams()
  const category = LESSON_CATEGORIES.find((item) => item.id === slug)

  const lessons = useMemo(
    () =>
      category
        ? makePlaceholderLessons(category.id, 8, { category: category.title })
        : [],
    [category],
  )

  if (!category) {
    return <Navigate to={APP_ROUTES.ALL_LESSONS} replace />
  }

  return (
    <LessonCollectionPage
      title={category.title}
      subtitle={category.subtitle}
      lessons={lessons}
    />
  )
}
