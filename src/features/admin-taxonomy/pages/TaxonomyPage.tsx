import { useState } from 'react'
import { AsyncSection, ConfirmDialog } from '@/shared/components'
import { useAsync } from '@/hooks'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import {
  CreateLevelForm,
  CreateNameForm,
  LevelBadge,
  PanelRow,
  TaxonomyPanel,
} from '@/features/admin-taxonomy/components'
import { taxonomyService } from '@/features/admin-taxonomy/services/taxonomy.service'

type TaxonomyKind = 'category' | 'topic' | 'level'

interface PendingDelete {
  kind: TaxonomyKind
  id: string
  name: string
  /** Message from the API's 409 — switches the dialog into force mode. */
  conflict: string | null
}

const DELETERS: Record<TaxonomyKind, (id: string, force?: boolean) => Promise<void>> = {
  category: taxonomyService.deleteCategory,
  topic: taxonomyService.deleteTopic,
  level: taxonomyService.deleteLevel,
}

function EmptyRow({ label }: { label: string }) {
  return <li className="px-2 py-2 text-sm text-ink-muted">{label}</li>
}

/**
 * Admin Taxonomy: the three option sources (categories, topics, levels) that
 * feed every filter and the lesson form. Deleting never rewrites existing
 * lessons — the option simply stops being offered for new ones.
 */
export function TaxonomyPage() {
  const notify = useToastStore((state) => state.notify)

  const [reloadKey, setReloadKey] = useState(0)
  const state = useAsync((signal) => taxonomyService.all(signal), [reloadKey])

  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const refresh = () => setReloadKey((key) => key + 1)

  /** Returns whether the create succeeded so the form only resets on success. */
  const handleCreate = async (
    label: string,
    action: () => Promise<unknown>,
  ): Promise<boolean> => {
    try {
      await action()
      notify(`${label} created.`)
      refresh()
      return true
    } catch (error) {
      notify(
        error instanceof ApiError
          ? error.message
          : `Could not create the ${label.toLowerCase()}.`,
        'error',
      )
      return false
    }
  }

  const requestDelete = (kind: TaxonomyKind, id: string, name: string) =>
    setPendingDelete({ kind, id, name, conflict: null })

  const confirmDelete = async () => {
    if (!pendingDelete) return

    setIsDeleting(true)
    try {
      // A prior 409 means the admin already saw the warning — force this time.
      await DELETERS[pendingDelete.kind](pendingDelete.id, pendingDelete.conflict !== null)
      notify(`"${pendingDelete.name}" deleted.`)
      setPendingDelete(null)
      refresh()
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setPendingDelete({ ...pendingDelete, conflict: error.message })
      } else {
        notify(
          error instanceof ApiError ? error.message : 'Delete failed. Please try again.',
          'error',
        )
        setPendingDelete(null)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <header>
        <h1 className="font-heading text-3xl font-extrabold text-ink">Taxonomy</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Categories, topics and levels power every filter and the lesson form.
        </p>
      </header>

      <div className="mt-8">
        <AsyncSection
          state={state}
          isEmpty={() => false}
          skeleton={
            <div className="grid gap-6 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-accent-100" />
              ))}
            </div>
          }
        >
          {({ categories, topics, levels }) => (
            <div className="grid items-start gap-6 lg:grid-cols-3">
              <TaxonomyPanel
                title="Categories"
                count={categories.length}
                form={
                  <CreateNameForm
                    label="New category name"
                    placeholder="New category…"
                    onCreate={(name) =>
                      handleCreate('Category', () =>
                        taxonomyService.createCategory({ name }),
                      )
                    }
                  />
                }
              >
                {categories.length === 0 && <EmptyRow label="No categories yet." />}
                {categories.map((category) => (
                  <PanelRow
                    key={category.id}
                    deleteLabel={`Delete category "${category.name}"`}
                    onDelete={() =>
                      requestDelete('category', category.id, category.name)
                    }
                  >
                    {category.name}
                  </PanelRow>
                ))}
              </TaxonomyPanel>

              <TaxonomyPanel
                title="Topics"
                count={topics.length}
                form={
                  <CreateNameForm
                    label="New topic name"
                    placeholder="New topic…"
                    onCreate={(name) =>
                      handleCreate('Topic', () => taxonomyService.createTopic({ name }))
                    }
                  />
                }
              >
                {topics.length === 0 && <EmptyRow label="No topics yet." />}
                {topics.map((topic) => (
                  <PanelRow
                    key={topic.id}
                    deleteLabel={`Delete topic "${topic.name}"`}
                    onDelete={() => requestDelete('topic', topic.id, topic.name)}
                  >
                    {topic.name}
                  </PanelRow>
                ))}
              </TaxonomyPanel>

              <TaxonomyPanel
                title="Levels"
                count={levels.length}
                form={
                  <CreateLevelForm
                    onCreate={(payload) =>
                      handleCreate('Level', () => taxonomyService.createLevel(payload))
                    }
                  />
                }
              >
                {levels.length === 0 && <EmptyRow label="No levels yet." />}
                {levels.map((level) => (
                  <PanelRow
                    key={level.id}
                    deleteLabel={`Delete level "${level.name}"`}
                    onDelete={() => requestDelete('level', level.id, level.name)}
                  >
                    <LevelBadge level={level} />
                  </PanelRow>
                ))}
              </TaxonomyPanel>
            </div>
          )}
        </AsyncSection>
      </div>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title={pendingDelete?.conflict ? 'Still in use' : `Delete ${pendingDelete?.kind ?? ''}`}
        confirmLabel={pendingDelete?.conflict ? 'Delete anyway' : 'Delete'}
        isBusy={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        message={
          pendingDelete?.conflict ? (
            <>
              <p>{pendingDelete.conflict}</p>
              <p className="mt-2">
                Existing lessons keep their current value either way.
              </p>
            </>
          ) : (
            <>
              Delete <strong>{pendingDelete?.name}</strong>? It stops being available
              for new lessons; existing lessons keep their current value.
            </>
          )
        }
      />
    </div>
  )
}
