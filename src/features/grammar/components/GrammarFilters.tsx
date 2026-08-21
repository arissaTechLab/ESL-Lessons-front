import { MultiSelectDropdown, SortDropdown } from '@/shared/components'

/** Level options for the grammar filter dropdown. */
const GRAMMAR_LEVELS = [
  { value: 'B1', label: 'B1 (Intermediate)' },
  { value: 'B2', label: 'B2 (Upper-Intermediate)' },
  { value: 'C1', label: 'C1 (Advanced)' },
] as const

export interface GrammarFiltersState {
  search: string
  levels: string[]
  sort: string
}

const SORT_OPTIONS = [
  { value: 'az', label: 'Grammar A–Z' },
  { value: 'za', label: 'Grammar Z–A' },
] as const

interface GrammarFiltersProps {
  filters: GrammarFiltersState
  onChange: (patch: Partial<GrammarFiltersState>) => void
  onClear: () => void
}

export function GrammarFilters({
  filters,
  onChange,
  onClear,
}: GrammarFiltersProps) {
  return (
    <div>
      {/* Search */}
      <div className="pb-5">
        <div className="relative w-full max-w-sm">
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
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search grammar"
            aria-label="Search grammar"
            className="w-full rounded-full border border-ink/15 bg-cream py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 border-y border-ink/10 py-4">
        <MultiSelectDropdown
          label="Lesson level"
          title="CEFR Levels"
          options={GRAMMAR_LEVELS}
          selected={filters.levels}
          onApply={(values) => onChange({ levels: values })}
        />
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Clear all filters
        </button>

        <div className="sm:ml-auto">
          <SortDropdown
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={(value) => onChange({ sort: value })}
            label="Sort By"
          />
        </div>
      </div>
    </div>
  )
}
