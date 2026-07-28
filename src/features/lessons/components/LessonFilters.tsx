import { LEVEL_OPTIONS } from '../data/levels'
import { SeriesIcon } from './LessonCard'

export interface LessonFiltersState {
  search: string
  level: string
  category: string
  topic: string
  sort: string
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Sort by Release Date' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
] as const

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  /** Label for the "all" option (omit for the sort select). */
  allLabel?: string
  options: readonly { value: string; label: string }[]
}

function FilterSelect({ value, onChange, allLabel, options }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-full border border-ink/15 bg-cream px-4 py-1.5 text-sm text-ink-soft transition hover:border-ink/30 focus:border-brand-500 focus:outline-none"
    >
      {allLabel && <option value="all">{allLabel}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface LessonFiltersProps {
  filters: LessonFiltersState
  onChange: (patch: Partial<LessonFiltersState>) => void
  onClear: () => void
  categories: readonly string[]
  topics: readonly string[]
}

export function LessonFilters({
  filters,
  onChange,
  onClear,
  categories,
  topics,
}: LessonFiltersProps) {
  return (
    <div>
      {/* Search + series hint */}
      <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between">
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
            placeholder="Search grammar or lesson topic"
            aria-label="Search lessons"
            className="w-full rounded-full border border-ink/15 bg-cream py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none"
          />
        </div>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <SeriesIcon className="size-4 text-ink-soft" />
          Spot this icon? It means the lesson is part of a series!
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3 border-y border-ink/10 py-4">
        <FilterSelect
          value={filters.level}
          onChange={(value) => onChange({ level: value })}
          allLabel="Lesson level"
          options={LEVEL_OPTIONS}
        />
        <FilterSelect
          value={filters.category}
          onChange={(value) => onChange({ category: value })}
          allLabel="Lesson categories"
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          value={filters.topic}
          onChange={(value) => onChange({ topic: value })}
          allLabel="Lesson topic"
          options={topics.map((t) => ({ value: t, label: t }))}
        />
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Clear all filters
        </button>

        <div className="sm:ml-auto">
          <FilterSelect
            value={filters.sort}
            onChange={(value) => onChange({ sort: value })}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  )
}
