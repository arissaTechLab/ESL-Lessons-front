import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { APP_ROUTES } from '@/config/routes.constants'
import { LessonDetailContent } from '@/features/lessons'
import { useAsync } from '@/hooks/useAsync'
import { AsyncSection } from '@/shared/components/AsyncSection'
import { FolderPicker } from '@/features/client/components'
import {
  clientService,
  type MaterialDetail,
} from '@/features/client/services/client.service'

function MaterialActions({ lesson }: { lesson: MaterialDetail }) {
  const foldersState = useAsync((signal) => clientService.folders(signal), [])
  const [folderId, setFolderId] = useState(lesson.folderId)

  const assign = async (next: string | null) => {
    setFolderId(next)
    await clientService.assign(lesson.id, next).catch(() => undefined)
  }

  const open = async (kind: 'slides' | 'pdf') => {
    const { url } = await clientService.download(lesson.id, kind)
    window.open(url, '_blank', 'noopener')
  }

  return (
    <div className="mt-6 space-y-4">
      {lesson.isLocked ? (
        <Link to={APP_ROUTES.PRICING} className={buttonVariants('primary', 'md')}>
          Subscribe to get lesson
        </Link>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!lesson.resources?.googleSlidesUrl}
            onClick={() => void open('slides')}
            className={buttonVariants('primary', 'md')}
          >
            Download Google Slides
          </button>
          <button
            type="button"
            disabled={!lesson.resources?.pdfPlanUrl}
            onClick={() => void open('pdf')}
            className={buttonVariants('secondary', 'md')}
          >
            Download PDF plan
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-soft">Folder:</span>
        <div className="w-56">
          <FolderPicker
            value={folderId}
            folders={foldersState.data?.folders ?? []}
            onChange={(next) => void assign(next)}
          />
        </div>
      </div>
    </div>
  )
}

export function ClientMaterialPage() {
  const { slug } = useParams()

  const state = useAsync(
    (signal) => clientService.material(slug ?? '', signal),
    [slug],
  )

  if (!slug) {
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

      <AsyncSection state={state} isEmpty={() => false}>
        {(lesson) => (
          <LessonDetailContent
            lesson={lesson}
            actions={<MaterialActions lesson={lesson} />}
          />
        )}
      </AsyncSection>
    </>
  )
}
