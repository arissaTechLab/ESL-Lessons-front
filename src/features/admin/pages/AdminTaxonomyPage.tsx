import { useState } from 'react'
import { ApiError } from '@/service'
import { useAsync } from '@/hooks'
import { AsyncSection } from '@/shared/components'
import { AdminPageHeader, ConfirmModal, Toast } from '@/features/admin/components'
import { CEFR_LEVELS } from '@/features/lessons'
import { adminService } from '@/features/admin/services/admin.service'

const NEW_LEVEL_TEXT = '#27170c'
const DEFAULT_LEVEL_COLOR = '#e9e0f6'

/** What the confirm dialog is about to delete. */
type Pending = {
  kind: 'category' | 'topic' | 'level'
  id: string
  label: string
  /** Set after a 409: the API's in-use message; confirming retries with force. */
  inUseMessage?: string
}

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
  // Bumped after every mutation to refetch the lists.
  const [version, setVersion] = useState(0)
  const state = useAsync((signal) => adminService.taxonomy(signal), [version])
  const refresh = () => setVersion((v) => v + 1)

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

  const failMessage = (cause: unknown, fallback: string) =>
    cause instanceof ApiError ? cause.message : fallback

  const create = (request: Promise<unknown>, done: string) => {
    request
      .then(() => {
        refresh()
        flash(done)
      })
      .catch((cause: unknown) => flash(failMessage(cause, 'Could not save.')))
  }

  const confirmDelete = () => {
    if (!pending) return
    const target = pending
    setPending(null)

    const force = Boolean(target.inUseMessage)
    const remove =
      target.kind === 'category'
        ? adminService.deleteCategory(target.id, force)
        : target.kind === 'topic'
          ? adminService.deleteTopic(target.id, force)
          : adminService.deleteLevel(target.id, force)

    remove
      .then(() => {
        refresh()
        flash(`“${target.label}” deleted.`)
      })
      .catch((cause: unknown) => {
        // Still referenced by lessons → surface the count and offer force.
        if (cause instanceof ApiError && cause.status === 409) {
          // Drop the API's "?force=true" instruction — the modal offers it.
          const inUse = cause.message.split('Repeat the request')[0]?.trim()
          setPending({ ...target, inUseMessage: inUse || cause.message })
        } else {
          flash(failMessage(cause, 'Could not delete.'))
        }
      })
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
    adminService
      .createLevel({
        name: label,
        cefr: ordered,
        color: levelColor,
        textColor: NEW_LEVEL_TEXT,
      })
      .then(() => {
        setLevelLabel('')
        setLevelTags([])
        setLevelColor(DEFAULT_LEVEL_COLOR)
        refresh()
        flash('Level added.')
      })
      .catch((cause: unknown) =>
        flash(failMessage(cause, 'Could not add the level.')),
      )
  }

  return (
    <>
      <AdminPageHeader
        title="Taxonomy"
        description="Manage the categories, levels and topics available when creating lessons."
      />

      <AsyncSection state={state} isEmpty={() => false}>
        {({ categories, topics, levels }) => (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Categories */}
            <Panel
              title="Categories"
              description="The lesson types offered on the platform."
            >
              <div className="space-y-2">
                {categories.map((category) => (
                  <StringRow
                    key={category.id}
                    label={category.name}
                    onDelete={() =>
                      setPending({
                        kind: 'category',
                        id: category.id,
                        label: category.name,
                      })
                    }
                  />
                ))}
              </div>
              <div className="mt-3">
                <AddRow
                  placeholder="New category name"
                  onAdd={(v) =>
                    create(
                      adminService.createCategory({ name: v }),
                      'Category added.',
                    )
                  }
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
                    key={topic.id}
                    label={topic.name}
                    onDelete={() =>
                      setPending({
                        kind: 'topic',
                        id: topic.id,
                        label: topic.name,
                      })
                    }
                  />
                ))}
              </div>
              <div className="mt-3">
                <AddRow
                  placeholder="New topic name"
                  onAdd={(v) =>
                    create(adminService.createTopic({ name: v }), 'Topic added.')
                  }
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
                      style={{
                        backgroundColor: level.color,
                        color: level.textColor,
                      }}
                      title={level.name}
                    >
                      {level.cefr.join('/')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {level.name}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {level.cefr.join(' · ')}
                      </p>
                    </div>
                    <TrashButton
                      label={`Delete ${level.name}`}
                      onClick={() =>
                        setPending({
                          kind: 'level',
                          id: level.id,
                          label: level.name,
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
        )}
      </AsyncSection>

      <ConfirmModal
        open={pending !== null}
        title={`Delete ${pending?.kind ?? ''}`}
        message={
          pending?.inUseMessage ? (
            <>
              {pending.inUseMessage} Delete <strong>“{pending.label}”</strong>{' '}
              anyway?
            </>
          ) : (
            <>
              Delete <strong>“{pending?.label}”</strong>? It won’t be selectable
              for new lessons. Existing lessons keep their current value.
            </>
          )
        }
        confirmLabel={pending?.inUseMessage ? 'Delete anyway' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />

      {toast && <Toast message={toast} />}
    </>
  )
}
