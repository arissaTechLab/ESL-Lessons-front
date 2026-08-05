import { Link, Navigate, useParams } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import { LessonDetailContent, getLessonById } from '@/features/lessons'
import { FolderPicker } from '@/features/client/components'
import { useFoldersStore } from '@/features/client/store/folders.store'

function MaterialActions({ lessonId }: { lessonId: string }) {
  const folders = useFoldersStore((s) => s.folders)
  const folderId = useFoldersStore(
    (s) => s.assignments.find((a) => a.lessonId === lessonId)?.folderId ?? null,
  )
  const assign = useFoldersStore((s) => s.assign)

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonVariants('primary', 'md')}>
          Download Google Slides
        </button>
        <button type="button" className={buttonVariants('secondary', 'md')}>
          Download PDF plan
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-soft">Folder:</span>
        <div className="w-56">
          <FolderPicker
            value={folderId}
            folders={folders}
            onChange={(next) => assign(lessonId, next)}
          />
        </div>
      </div>
    </div>
  )
}

export function ClientMaterialPage() {
  const { slug } = useParams()
  const lesson = slug ? getLessonById(slug) : undefined

  if (!lesson) {
    return <Navigate to={APP_ROUTES.CLIENT_MATERIALS} replace />
  }

  return (
    <>
      <Link
        to={APP_ROUTES.CLIENT_MATERIALS}
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
      >
        ← Back to materials
      </Link>

      <LessonDetailContent
        lesson={lesson}
        actions={<MaterialActions lessonId={lesson.id} />}
      />
    </>
  )
}
