import { Navigate, useParams } from 'react-router-dom'
import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { APP_ROUTES } from '@/config/routes.constants'
import { LessonCollectionPage } from '@/features/lessons/components'
import { lessonsService } from '@/features/lessons/services/lessons.service'

export function CategoryLessonsPage() {
  const { slug = '' } = useParams()
  const state = useAsync((signal) => lessonsService.categories(signal), [])

  return (
    <AsyncSection state={state} isEmpty={() => false}>
      {(categories) => {
        const category = categories.find((item) => item.slug === slug)

        if (!category) {
          return <Navigate to={APP_ROUTES.ALL_LESSONS} replace />
        }

        return (
          <LessonCollectionPage
            title={category.title}
            subtitle={category.subtitle}
            query={{ categories: [category.slug] }}
          />
        )
      }}
    </AsyncSection>
  )
}
