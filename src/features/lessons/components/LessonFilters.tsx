import { MultiSelect, SearchInput } from '@/shared/components'
import type { MultiSelectOption } from '@/shared/components'
import { useAsync } from '@/hooks'
import { lessonsService } from '@/features/lessons/services/lessons.service'
import type {
  CatalogueFilterState,
  LessonSort,
} from '@/features/lessons/types/lesson.types'

interface LessonFiltersProps {
  value: CatalogueFilterState
  onChange: (value: CatalogueFilterState) => void
  /** Category pages are already scoped to one category. */
  hideCategory?: boolean
}

/** The public level filter works on CEFR codes, not level slugs. */
const CEFR_OPTIONS: MultiSelectOption[] = ['A1', 'A2', 'B1', 'B2', 'C1'].map(
  (code) => ({ value: code, label: code }),
)

const SORT_OPTIONS: { value: LessonSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title A–Z' },
]

function toOptions(
  entries: { slug: string; name: string }[] = [],
): MultiSelectOption[] {
  return entries.map((entry) => ({ value: entry.slug, label: entry.name }))
}

/**
 * The shared filter bar of the public catalogue: search, level / category /
 * topic multi-selects and a sort order. Fully controlled — pages own the state
 * (in the URL) so a filtered view survives navigation and reload.
 */
export function LessonFilters({
  value,
  onChange,
  hideCategory = false,
}: LessonFiltersProps) {
  // Options only — the bar stays usable while taxonomy loads.
  const taxonomy = useAsync((signal) => lessonsService.taxonomy(signal), [])

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput
        value={value.q}
        onChange={(q) => onChange({ ...value, q })}
        placeholder="Search lessons…"
        className="lg:flex-1"
      />

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <MultiSelect
          label="Level"
          options={CEFR_OPTIONS}
          selected={value.levels}
          onChange={(levels) => onChange({ ...value, levels })}
          className="sm:w-36"
        />
        {!hideCategory && (
          <MultiSelect
            label="Category"
            options={toOptions(taxonomy.data?.categories)}
            selected={value.categories}
            onChange={(categories) => onChange({ ...value, categories })}
            className="sm:w-44"
          />
        )}
        <MultiSelect
          label="Topic"
          options={toOptions(taxonomy.data?.topics)}
          selected={value.topics}
          onChange={(topics) => onChange({ ...value, topics })}
          className="sm:w-40"
        />
        <label className="sm:w-36">
          <span className="sr-only">Sort lessons</span>
          <select
            value={value.sort}
            onChange={(event) =>
              onChange({ ...value, sort: event.target.value as LessonSort })
            }
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition hover:border-ink/30 focus:border-brand-500 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
