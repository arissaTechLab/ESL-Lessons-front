import { useMemo, useState } from 'react'
import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import {
  GrammarFilters,
  GrammarTable,
  type GrammarFiltersState,
} from '@/features/grammar/components'
import { GRAMMAR_ENTRIES } from '@/features/grammar/data/grammar'

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

  const entries = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    const matched = GRAMMAR_ENTRIES.filter((entry) => {
      const matchesLevel =
        filters.levels.length === 0 || filters.levels.includes(entry.level)
      const matchesQuery =
        query === '' || entry.point.toLowerCase().includes(query)
      return matchesLevel && matchesQuery
    })
    const sorted = [...matched].sort((a, b) => a.point.localeCompare(b.point))
    return filters.sort === 'za' ? sorted.reverse() : sorted
  }, [filters])

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
        <GrammarTable entries={entries} />
      </section>

      <CtaSection />
    </>
  )
}
