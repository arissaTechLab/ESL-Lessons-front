import { useState, type FormEvent } from 'react'
import { Button, ConfirmDialog, Modal } from '@/shared/components'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import { materialsService } from '@/features/materials/services/materials.service'
import type { Folder, FolderList } from '@/features/materials/types/material.types'

interface FolderChipsProps {
  folders: FolderList
  /** `null` = All, `'uncategorized'`, or a folder id. */
  active: string | null
  onSelect: (folder: string | null) => void
  /** Called after a folder is created or deleted so the owner refetches. */
  onChanged: () => void
}

const CHIP_ON = 'border-brand-500 bg-brand-500 text-white'
const CHIP_OFF =
  'border-ink/15 bg-white text-ink-soft hover:border-brand-500 hover:text-brand-600'

function chipClasses(isActive: boolean): string {
  return `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
    isActive ? CHIP_ON : CHIP_OFF
  }`
}

function notifyError(caught: unknown, fallback: string): void {
  useToastStore
    .getState()
    .notify(caught instanceof ApiError ? caught.message : fallback, 'error')
}

/**
 * The folder filter row: All / Uncategorized / one chip per folder (with its
 * count and a delete affordance), plus the "+ New folder" modal.
 */
export function FolderChips({
  folders,
  active,
  onSelect,
  onChanged,
}: FolderChipsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Folder | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return

    setIsCreating(true)
    try {
      await materialsService.createFolder(name)
      useToastStore.getState().notify(`Folder "${name}" created`)
      setIsCreateOpen(false)
      setNewName('')
      onChanged()
    } catch (caught) {
      notifyError(caught, 'Could not create the folder.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return

    setIsDeleting(true)
    try {
      await materialsService.deleteFolder(pendingDelete.id)
      useToastStore.getState().notify(`Folder "${pendingDelete.name}" deleted`)
      // Deleting the folder currently filtering the grid would strand the view.
      if (active === pendingDelete.id) onSelect(null)
      setPendingDelete(null)
      onChanged()
    } catch (caught) {
      notifyError(caught, 'Could not delete the folder.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      role="group"
      aria-label="Filter by folder"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        aria-pressed={active === null}
        onClick={() => onSelect(null)}
        className={chipClasses(active === null)}
      >
        All <span className="font-normal opacity-80">({folders.allCount})</span>
      </button>

      <button
        type="button"
        aria-pressed={active === 'uncategorized'}
        onClick={() => onSelect('uncategorized')}
        className={chipClasses(active === 'uncategorized')}
      >
        Uncategorized{' '}
        <span className="font-normal opacity-80">
          ({folders.uncategorizedCount})
        </span>
      </button>

      {folders.folders.map((folder) => {
        const isActive = active === folder.id
        return (
          <span key={folder.id} className={chipClasses(isActive)}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(folder.id)}
              className="inline-flex items-center gap-1.5"
            >
              {folder.name}{' '}
              <span className="font-normal opacity-80">({folder.count})</span>
            </button>
            <button
              type="button"
              aria-label={`Delete folder ${folder.name}`}
              onClick={() => setPendingDelete(folder)}
              className={`-mr-1 grid size-4 place-items-center rounded-full transition ${
                isActive
                  ? 'text-white/80 hover:bg-white/20 hover:text-white'
                  : 'text-ink-muted hover:bg-ink/10 hover:text-ink'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </span>
        )
      })}

      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink/25 px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-brand-500 hover:text-brand-600"
      >
        + New folder
      </button>

      <Modal
        isOpen={isCreateOpen}
        title="New folder"
        onClose={() => setIsCreateOpen(false)}
      >
        <form onSubmit={(event) => void handleCreate(event)}>
          <label className="block text-sm">
            <span className="font-medium text-ink">Folder name</span>
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="e.g. Monday classes"
              autoFocus
              required
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-ink/30"
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={isCreating || !newName.trim()}>
              {isCreating ? 'Creating…' : 'Create folder'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Delete folder"
        message={
          <>
            Delete <strong>“{pendingDelete?.name}”</strong>? Its lessons move
            back to Uncategorized — nothing is removed from your library.
          </>
        }
        isBusy={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
