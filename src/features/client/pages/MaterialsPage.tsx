import { useState } from 'react'
import { LessonCard } from '@/features/lessons'
import { clientMaterialPath } from '@/config/routes.constants'
import { useAsync } from '@/hooks/useAsync'
import { AsyncSection } from '@/shared/components/AsyncSection'
import { clientService } from '@/features/client/services/client.service'
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
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<string>('all')
  const [folder, setFolder] = useState<string>('all')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  // Bumped after every folder mutation so both queries refetch.
  const [version, setVersion] = useState(0)

  const refresh = () => setVersion((v) => v + 1)

  const foldersState = useAsync(
    (signal) => clientService.folders(signal),
    [version],
  )

  const materialsState = useAsync(
    (signal) =>
      clientService.materials(
        {
          q: search.trim() || undefined,
          tab: tab as 'all' | 'free' | 'paid',
          folder:
            folder === 'all'
              ? undefined
              : folder === UNFILED
                ? 'uncategorized'
                : folder,
          limit: 100,
        },
        signal,
      ),
    [search, tab, folder, version],
  )

  const folders = foldersState.data?.folders ?? []

  const addFolder = async () => {
    const trimmed = name.trim()
    if (trimmed) {
      await clientService.createFolder(trimmed).catch(() => undefined)
      refresh()
    }
    setName('')
    setCreating(false)
  }

  const removeFolder = async (id: string) => {
    await clientService.deleteFolder(id).catch(() => undefined)
    setFolder('all')
    refresh()
  }

  const assign = async (lessonId: string, folderId: string | null) => {
    await clientService.assign(lessonId, folderId).catch(() => undefined)
    refresh()
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
      <AsyncSection
        state={foldersState}
        isEmpty={() => false}
        skeleton={
          <div
            className="mb-4 h-9 w-full max-w-md animate-pulse rounded-full bg-accent-100"
            aria-hidden="true"
          />
        }
      >
        {(summary) => (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <FolderChip
              label="All"
              count={summary.allCount}
              active={folder === 'all'}
              onClick={() => setFolder('all')}
            />
            <FolderChip
              label="Uncategorized"
              count={summary.uncategorizedCount}
              active={folder === UNFILED}
              onClick={() => setFolder(UNFILED)}
            />
            {summary.folders.map((f) => (
              <FolderChip
                key={f.id}
                label={f.name}
                count={f.count}
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
                  onKeyDown={(e) => e.key === 'Enter' && void addFolder()}
                  placeholder="Folder name"
                  className="w-40 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void addFolder()}
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
                onClick={() => void removeFolder(folder)}
                className="ml-1 text-sm font-medium text-rose-600 transition hover:text-rose-700"
              >
                Delete folder
              </button>
            )}
          </div>
        )}
      </AsyncSection>

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

      <AsyncSection
        state={materialsState}
        isEmpty={(page) => page.items.length === 0}
        empty={
          <div className="rounded-xl border border-dashed border-ink/20 py-16 text-center">
            <p className="text-ink-soft">No lessons match this view.</p>
          </div>
        }
      >
        {(page) => (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {page.items.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                to={clientMaterialPath(lesson.slug)}
                footer={
                  <FolderPicker
                    value={lesson.folderId}
                    folders={folders}
                    onChange={(folderId) => void assign(lesson.id, folderId)}
                  />
                }
              />
            ))}
          </div>
        )}
      </AsyncSection>
    </>
  )
}
