import { useNavigate } from 'react-router-dom'
import { APP_ROUTES, path } from '@/config/routes.constants'
import { LessonCard } from '@/features/lessons'
import { FolderSelect } from '@/features/materials/components/FolderSelect'
import type { Folder, Material } from '@/features/materials/types/material.types'

interface MaterialCardProps {
  material: Material
  folders: Folder[]
  /** Called after the folder assignment changes so the grid refetches. */
  onChanged: () => void
}

/**
 * The shared {@link LessonCard} tile plus the client-only folder dropdown.
 * A green ring marks cards already filed in a folder.
 */
export function MaterialCard({ material, folders, onChanged }: MaterialCardProps) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex-1 rounded-xl ${
          material.folderId !== null ? 'ring-2 ring-accent-600/60' : ''
        }`}
      >
        <LessonCard
          lesson={material}
          onOpen={() =>
            navigate(path(APP_ROUTES.APP_MATERIAL, { slug: material.slug }))
          }
        />
      </div>
      <div className="mt-2">
        <FolderSelect
          lessonId={material.id}
          folderId={material.folderId}
          folders={folders}
          onAssigned={onChanged}
        />
      </div>
    </div>
  )
}
