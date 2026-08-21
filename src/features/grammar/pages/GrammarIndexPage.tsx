import { useState } from 'react'
import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import {
  GrammarFilters,
  GrammarTable,
  type GrammarFiltersState,
} from '@/features/grammar/components'
import { grammarService } from '@/features/grammar/services/grammar.service'
import type { GrammarEntry } from '@/features/grammar/types/grammar.types'

const DEFAULT_FILTERS: GrammarFiltersState = {
  search: '',
  levels: [],
  sort: 'az',
}

export function GrammarIndexPage() {
  const [filters, setFilters] = useState<GrammarFiltersState>(DEFAULT_FILTERS)

  const update = (patch: Partial<GrammarFiltersState>) =>
    setFilters((current) => ({ ...current, ...patch }))
  const clear = () => setFilters(DEFAULT_FILTERS)

  // The level filter drives the `cefr` query server-side.
  const state = useAsync(
    (signal) => grammarService.list(filters.levels, signal),
    [filters.levels.join(',')],
  )

  // Search and sort stay client-side over the fetched rows.
  const refine = (rows: readonly GrammarEntry[]): GrammarEntry[] => {
    const query = filters.search.trim().toLowerCase()
    const matched = rows.filter(
      (entry) => query === '' || entry.point.toLowerCase().includes(query),
    )
    const sorted = [...matched].sort((a, b) => a.point.localeCompare(b.point))
    return filters.sort === 'za' ? sorted.reverse() : sorted
  }

  return (
    <>
      <PageHeader
        title="Grammar Index"
        subtitle="Clear, visual, and context-rich grammar lessons—organized for easy browsing."
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <GrammarFilters filters={filters} onChange={update} onClear={clear} />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <AsyncSection state={state} isEmpty={() => false}>
          {(entries) => <GrammarTable entries={refine(entries)} />}
        </AsyncSection>
      </section>

      <CtaSection />
    </>
  )
}
