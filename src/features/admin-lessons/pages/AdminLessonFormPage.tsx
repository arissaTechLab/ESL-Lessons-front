import { Link, useParams } from 'react-router-dom'
import { AsyncSection, buttonVariants } from '@/shared/components'
import { useAsync } from '@/hooks'
import { APP_ROUTES } from '@/config/routes.constants'
import { taxonomyService } from '@/features/admin-taxonomy'
import { LessonForm } from '@/features/admin-lessons/components'
import { adminLessonsService } from '@/features/admin-lessons/services/admin-lessons.service'

/** One page for both `/admin/lessons/new` and `/admin/lessons/:id/edit`. */
export function AdminLessonFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id !== undefined

  const state = useAsync(
    async (signal) => {
      // The selects and the record load together so the form mounts complete.
      const [taxonomy, lesson] = await Promise.all([
        taxonomyService.all(signal),
        id ? adminLessonsService.get(id, signal) : Promise.resolve(null),
      ])
      return { taxonomy, lesson }
    },
    [id ?? 'new'],
  )

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">
            {isEditing ? 'Edit lesson' : 'New lesson'}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Category, level and topic options are managed on the Taxonomy screen.
          </p>
        </div>
        <Link to={APP_ROUTES.ADMIN_LESSONS} className={buttonVariants('tertiary', 'sm')}>
          Back to lessons
        </Link>
      </header>

      <div className="mt-8">
        <AsyncSection
          state={state}
          isEmpty={() => false}
          skeleton={
            <div
              className="h-[32rem] animate-pulse rounded-xl bg-accent-100"
              aria-hidden="true"
            />
          }
        >
          {({ taxonomy, lesson }) => (
            <LessonForm key={lesson?.id ?? 'new'} taxonomy={taxonomy} lesson={lesson} />
          )}
        </AsyncSection>
      </div>
    </div>
  )
}
