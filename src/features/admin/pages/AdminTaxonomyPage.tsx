import { useState } from 'react'
import { AdminPageHeader, ConfirmModal, Toast } from '@/features/admin/components'
import { CEFR_LEVELS, useTaxonomyStore } from '@/features/lessons'

const NEW_LEVEL_TEXT = '#27170c'
const DEFAULT_LEVEL_COLOR = '#e9e0f6'

/** What the confirm dialog is about to delete. */
type Pending =
  | { kind: 'category'; value: string; label: string }
  | { kind: 'topic'; value: string; label: string }
  | { kind: 'level'; value: string; label: string }

function TrashButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-7 shrink-0 place-items-center rounded-md text-ink-muted transition hover:bg-rose-50 hover:text-rose-600"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
      </svg>
    </button>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-ink/10 bg-white/60 p-6">
      <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Text input + Add button for the simple string lists. */
function AddRow({
  placeholder,
  onAdd,
}: {
  placeholder: string
  onAdd: (value: string) => void
}) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submit())}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <button
        type="button"
        onClick={submit}
        className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Add
      </button>
    </div>
  )
}

/** A removable row for categories / topics. */
function StringRow({
  label,
  onDelete,
}: {
  label: string
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white px-3 py-2">
      <span className="min-w-0 flex-1 truncate text-sm text-ink">{label}</span>
      <TrashButton label={`Delete ${label}`} onClick={onDelete} />
    </div>
  )
}

export function AdminTaxonomyPage() {
  const categories = useTaxonomyStore((s) => s.categories)
  const topics = useTaxonomyStore((s) => s.topics)
  const levels = useTaxonomyStore((s) => s.levels)
  const addCategory = useTaxonomyStore((s) => s.addCategory)
  const removeCategory = useTaxonomyStore((s) => s.removeCategory)
  const addTopic = useTaxonomyStore((s) => s.addTopic)
  const removeTopic = useTaxonomyStore((s) => s.removeTopic)
  const addLevel = useTaxonomyStore((s) => s.addLevel)
  const removeLevel = useTaxonomyStore((s) => s.removeLevel)

  const [pending, setPending] = useState<Pending | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // New-level form.
  const [levelLabel, setLevelLabel] = useState('')
  const [levelTags, setLevelTags] = useState<string[]>([])
  const [levelColor, setLevelColor] = useState(DEFAULT_LEVEL_COLOR)

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2500)
  }

  const confirmDelete = () => {
    if (!pending) return
    if (pending.kind === 'category') removeCategory(pending.value)
    if (pending.kind === 'topic') removeTopic(pending.value)
    if (pending.kind === 'level') removeLevel(pending.value)
    flash(`“${pending.label}” deleted.`)
    setPending(null)
  }

  const toggleTag = (tag: string) =>
    setLevelTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    )

  const submitLevel = () => {
    const label = levelLabel.trim()
    if (!label || levelTags.length === 0) return
    // Keep tags in CEFR order regardless of click order.
    const ordered = CEFR_LEVELS.map((c) => c.value).filter((v) =>
      levelTags.includes(v),
    )
    addLevel({ label, tags: ordered, bg: levelColor, text: NEW_LEVEL_TEXT })
    setLevelLabel('')
    setLevelTags([])
    setLevelColor(DEFAULT_LEVEL_COLOR)
    flash('Level added.')
  }

  return (
    <>
      <AdminPageHeader
        title="Taxonomy"
        description="Manage the categories, levels and topics available when creating lessons."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Categories */}
        <Panel
          title="Categories"
          description="The lesson types offered on the platform."
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <StringRow
                key={category}
                label={category}
                onDelete={() =>
                  setPending({
                    kind: 'category',
                    value: category,
                    label: category,
                  })
                }
              />
            ))}
          </div>
          <div className="mt-3">
            <AddRow
              placeholder="New category name"
              onAdd={(v) => {
                addCategory(v)
                flash('Category added.')
              }}
            />
          </div>
        </Panel>

        {/* Topics */}
        <Panel
          title="Topics"
          description="Themes a lesson can be tagged with."
        >
          <div className="space-y-2">
            {topics.map((topic) => (
              <StringRow
                key={topic}
                label={topic}
                onDelete={() =>
                  setPending({ kind: 'topic', value: topic, label: topic })
                }
              />
            ))}
          </div>
          <div className="mt-3">
            <AddRow
              placeholder="New topic name"
              onAdd={(v) => {
                addTopic(v)
                flash('Topic added.')
              }}
            />
          </div>
        </Panel>

        {/* Levels */}
        <Panel
          title="Levels"
          description="Each level carries its CEFR tags and badge color."
        >
          <div className="space-y-2">
            {levels.map((level) => (
              <div
                key={level.id}
                className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white px-3 py-2"
              >
                <span
                  className="grid size-8 shrink-0 place-items-center rounded text-[10px] font-bold"
                  style={{ backgroundColor: level.bg, color: level.text }}
                  title={level.label}
                >
                  {level.tags.join('/')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {level.label}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {level.tags.join(' · ')}
                  </p>
                </div>
                <TrashButton
                  label={`Delete ${level.label}`}
                  onClick={() =>
                    setPending({
                      kind: 'level',
                      value: level.id,
                      label: level.label,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* New level form */}
          <div className="mt-4 space-y-3 rounded-lg border border-dashed border-ink/20 bg-white p-4">
            <p className="text-sm font-semibold text-ink">Add a level</p>
            <input
              value={levelLabel}
              onChange={(e) => setLevelLabel(e.target.value)}
              placeholder="Level name (e.g. Advanced)"
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                CEFR tags
              </p>
              <div className="flex flex-wrap gap-2">
                {CEFR_LEVELS.map((cefr) => {
                  const on = levelTags.includes(cefr.value)
                  return (
                    <button
                      key={cefr.value}
                      type="button"
                      onClick={() => toggleTag(cefr.value)}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                        on
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-ink/15 text-ink-soft hover:border-ink/30'
                      }`}
                    >
                      {cefr.value}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                Badge color
                <input
                  type="color"
                  value={levelColor}
                  onChange={(e) => setLevelColor(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border border-ink/15 bg-white"
                  aria-label="Badge color"
                />
              </label>
              <span
                className="grid size-8 place-items-center rounded text-[10px] font-bold"
                style={{ backgroundColor: levelColor, color: NEW_LEVEL_TEXT }}
              >
                {levelTags.length ? levelTags.join('/') : 'Aa'}
              </span>
              <button
                type="button"
                onClick={submitLevel}
                disabled={!levelLabel.trim() || levelTags.length === 0}
                className="ml-auto rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add level
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <ConfirmModal
        open={pending !== null}
        title={`Delete ${pending?.kind ?? ''}`}
        message={
          <>
            Delete <strong>“{pending?.label}”</strong>? It won’t be selectable
            for new lessons. Existing lessons keep their current value.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />

      {toast && <Toast message={toast} />}
    </>
  )
}
