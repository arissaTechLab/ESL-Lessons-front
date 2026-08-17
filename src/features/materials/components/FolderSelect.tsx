import { useState } from 'react'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import { materialsService } from '@/features/materials/services/materials.service'
import type { Folder } from '@/features/materials/types/material.types'

interface FolderSelectProps {
  lessonId: string
  folderId: string | null
  folders: Folder[]
  /** Called after a successful assign so the owner can refetch. */
  onAssigned: () => void
  label?: string
}

/**
 * The small "Add to folder" dropdown shown under each material card and on the
 * detail page. Tinted green while the lesson is filed somewhere.
 */
export function FolderSelect({
  lessonId,
  folderId,
  folders,
  onAssigned,
  label = 'Add to folder',
}: FolderSelectProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = async (value: string) => {
    setIsSaving(true)
    try {
      await materialsService.assign(lessonId, value === '' ? null : value)
      useToastStore
        .getState()
        .notify(value === '' ? 'Moved to Uncategorized' : 'Added to folder')
      onAssigned()
    } catch (caught) {
      useToastStore
        .getState()
        .notify(
          caught instanceof ApiError
            ? caught.message
            : 'Could not update the folder.',
          'error',
        )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-ink-soft">
      <span className="shrink-0">{label}</span>
      <select
        value={folderId ?? ''}
        onChange={(event) => void handleChange(event.target.value)}
        disabled={isSaving}
        aria-label={label}
        className={`w-full rounded-lg border px-2.5 py-1.5 text-xs transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-60 ${
          folderId !== null
            ? 'border-accent-600 bg-accent-100 font-semibold text-accent-800'
            : 'border-ink/15 bg-white text-ink'
        }`}
      >
        <option value="">Uncategorized</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </label>
  )
}
