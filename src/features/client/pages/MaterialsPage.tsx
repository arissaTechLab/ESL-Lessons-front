import { useMemo, useState } from 'react'
import { LESSONS, LessonCard } from '@/features/lessons'
import { clientMaterialPath } from '@/config/routes.constants'
import { useFoldersStore } from '@/features/client/store/folders.store'
import { FolderPicker } from '@/features/client/components'

const UNFILED = 'none'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
] as const

function FolderChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-ink/15 text-ink-soft hover:border-ink/30'
      }`}
    >
      {label}
      <span className="text-xs text-ink-muted">{count}</span>
    </button>
  )
}

export function MaterialsPage() {
  const folders = useFoldersStore((s) => s.folders)
  const assignments = useFoldersStore((s) => s.assignments)
  const assign = useFoldersStore((s) => s.assign)
  const createFolder = useFoldersStore((s) => s.createFolder)
  const deleteFolder = useFoldersStore((s) => s.deleteFolder)

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<string>('all')
  const [folder, setFolder] = useState<string>('all')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  // lessonId -> folderId, for O(1) lookups.
  const folderOf = useMemo(() => {
    const map = new Map<string, string>()
    for (const a of assignments) map.set(a.lessonId, a.folderId)
    return map
  }, [assignments])

  const counts = useMemo(() => {
    const byFolder = new Map<string, number>()
    for (const a of assignments) {
      byFolder.set(a.folderId, (byFolder.get(a.folderId) ?? 0) + 1)
    }
    return {
      total: LESSONS.length,
      unfiled: LESSONS.length - assignments.length,
      byFolder,
    }
  }, [assignments])

  const results = useMemo(() => {
    const query = search.trim().toLowerCase()
    return LESSONS.filter((lesson) => {
      if (tab === 'free' && !lesson.isFree) return false
      if (tab === 'paid' && lesson.isFree) return false

      const assigned = folderOf.get(lesson.id) ?? null
      if (folder === UNFILED && assigned !== null) return false
      if (folder !== 'all' && folder !== UNFILED && assigned !== folder)
        return false

      if (query === '') return true
      return (
        lesson.title.toLowerCase().includes(query) ||
        lesson.category.toLowerCase().includes(query) ||
        lesson.topic.toLowerCase().includes(query)
      )
    })
  }, [search, tab, folder, folderOf])

  const addFolder = () => {
    const trimmed = name.trim()
    if (trimmed) createFolder(trimmed)
    setName('')
    setCreating(false)
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            Materials
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Every lesson is yours to use. Organize them into folders however you
            like.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <svg
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search materials"
            aria-label="Search materials"
            className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Folder filter + management */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FolderChip
          label="All"
          count={counts.total}
          active={folder === 'all'}
          onClick={() => setFolder('all')}
        />
        <FolderChip
          label="Uncategorized"
          count={counts.unfiled}
          active={folder === UNFILED}
          onClick={() => setFolder(UNFILED)}
        />
        {folders.map((f) => (
          <FolderChip
            key={f.id}
            label={f.name}
            count={counts.byFolder.get(f.id) ?? 0}
            active={folder === f.id}
            onClick={() => setFolder(f.id)}
          />
        ))}

        {creating ? (
          <span className="flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFolder()}
              placeholder="Folder name"
              className="w-40 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addFolder}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Add
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-ink/30 px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-brand-400 hover:text-brand-600"
          >
            + New folder
          </button>
        )}

        {folder !== 'all' && folder !== UNFILED && (
          <button
            type="button"
            onClick={() => {
              deleteFolder(folder)
              setFolder('all')
            }}
            className="ml-1 text-sm font-medium text-rose-600 transition hover:text-rose-700"
          >
            Delete folder
          </button>
        )}
      </div>

      {/* Free / paid tabs */}
      <div className="mb-6 inline-flex rounded-lg border border-ink/15 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              tab === t.value
                ? 'bg-brand-500 text-white'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              to={clientMaterialPath(lesson.id)}
              footer={
                <FolderPicker
                  value={folderOf.get(lesson.id) ?? null}
                  folders={folders}
                  onChange={(folderId) => assign(lesson.id, folderId)}
                />
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ink/20 py-16 text-center">
          <p className="text-ink-soft">No lessons match this view.</p>
        </div>
      )}
    </>
  )
}
