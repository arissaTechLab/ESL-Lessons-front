import { useEffect, useState } from 'react'
import { AsyncSection, Pagination, SearchInput } from '@/shared/components'
import { useAsync } from '@/hooks'
import { FolderChips, MaterialCard } from '@/features/materials/components'
import { materialsService } from '@/features/materials/services/materials.service'
import type { MaterialTab } from '@/features/materials/types/material.types'

const TABS: { id: MaterialTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
]

const PAGE_SIZE = 12

/** The client's library: search + access tabs + folder chips + the lesson grid. */
export function MaterialsPage() {
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [tab, setTab] = useState<MaterialTab>('all')
  const [folder, setFolder] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  // Bumped after any folder mutation so both the chips and the grid refetch.
  const [version, setVersion] = useState(0)

  // Debounce so the grid doesn't refetch on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q.trim()), 300)
    return () => clearTimeout(timer)
  }, [q])

  const foldersState = useAsync(
    (signal) => materialsService.folders(signal),
    [version],
  )

  const listState = useAsync(
    (signal) =>
      materialsService.list(
        {
          q: debouncedQ || undefined,
          tab: tab === 'all' ? undefined : tab,
          folder: folder ?? undefined,
          page,
          limit: PAGE_SIZE,
        },
        signal,
      ),
    [debouncedQ, tab, folder, page, version],
  )

  // Every filter change restarts from page 1 — page N of the old filter is
  // meaningless under the new one.
  const applySearch = (value: string) => {
    setQ(value)
    setPage(1)
  }
  const applyTab = (next: MaterialTab) => {
    setTab(next)
    setPage(1)
  }
  const applyFolder = (next: string | null) => {
    setFolder(next)
    setPage(1)
  }
  const refresh = () => setVersion((current) => current + 1)

  return (
    <>
      <h1 className="font-heading text-3xl font-extrabold text-ink">
        My materials
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Every lesson in the library — search it, filter it, organise it into
        folders.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={q}
          onChange={applySearch}
          placeholder="Search materials…"
          className="sm:max-w-xs sm:flex-1"
        />

        <div
          role="group"
          aria-label="Filter by access"
          className="flex self-start rounded-lg border border-ink/15 bg-white p-1"
        >
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={tab === entry.id}
              onClick={() => applyTab(entry.id)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
                tab === entry.id
                  ? 'bg-brand-500 text-white'
                  : 'text-ink-soft hover:text-brand-600'
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <AsyncSection
          state={foldersState}
          isEmpty={() => false}
          skeleton={
            <div
              className="h-8 w-72 max-w-full animate-pulse rounded-full bg-accent-100"
              aria-hidden="true"
            />
          }
        >
          {(folderList) => (
            <FolderChips
              folders={folderList}
              active={folder}
              onSelect={applyFolder}
              onChanged={refresh}
            />
          )}
        </AsyncSection>
      </div>

      <div className="mt-8">
        <AsyncSection
          state={listState}
          isEmpty={(result) => result.items.length === 0}
          empty={
            <p className="py-10 text-center text-sm text-ink-muted">
              No lessons match your filters yet.
            </p>
          }
        >
          {(result) => (
            <>
              <p className="mb-4 text-sm text-ink-muted">
                {result.total} {result.total === 1 ? 'lesson' : 'lessons'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {result.items.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    folders={foldersState.data?.folders ?? []}
                    onChanged={refresh}
                  />
                ))}
              </div>
              <Pagination
                page={result.page}
                pages={result.pages}
                onChange={setPage}
              />
            </>
          )}
        </AsyncSection>
      </div>
    </>
  )
}
