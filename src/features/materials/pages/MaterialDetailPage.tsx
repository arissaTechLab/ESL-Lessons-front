import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes.constants'
import {
  AsyncSection,
  Button,
  Placeholder,
  buttonVariants,
} from '@/shared/components'
import { useAsync } from '@/hooks'
import { ApiError } from '@/service'
import { useToastStore } from '@/store/toast.store'
import { FolderSelect } from '@/features/materials/components'
import { materialsService } from '@/features/materials/services/materials.service'
import type {
  DownloadKind,
  MaterialDetail,
} from '@/features/materials/types/material.types'

function formatDate(value: string | null): string {
  if (!value) return 'Unpublished'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function DownloadsCard({ material }: { material: MaterialDetail }) {
  const [busyKind, setBusyKind] = useState<DownloadKind | null>(null)

  const handleDownload = async (kind: DownloadKind) => {
    setBusyKind(kind)
    try {
      // The POST records the download event; the URL opens in a new tab.
      const { url } = await materialsService.download(material.id, kind)
      window.open(url, '_blank', 'noopener')
    } catch (caught) {
      useToastStore
        .getState()
        .notify(
          caught instanceof ApiError
            ? caught.message
            : 'Download failed. Please try again.',
          'error',
        )
    } finally {
      setBusyKind(null)
    }
  }

  if (material.isLocked) {
    return (
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-5">
        <h2 className="font-heading text-sm font-bold text-ink">
          Unlock this lesson
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Downloads are part of the subscription. Subscribe to get every Google
          Slides deck and PDF plan in the library.
        </p>
        <Link
          to={APP_ROUTES.PRICING}
          className={buttonVariants('primary', 'sm', 'mt-4')}
        >
          See plans
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <h2 className="font-heading text-sm font-bold text-ink">Downloads</h2>
      <div className="mt-3 flex flex-col gap-2">
        <Button
          size="sm"
          disabled={material.resources?.googleSlidesUrl == null || busyKind !== null}
          onClick={() => void handleDownload('slides')}
        >
          {busyKind === 'slides' ? 'Preparing…' : 'Download Google Slides'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={material.resources?.pdfPlanUrl == null || busyKind !== null}
          onClick={() => void handleDownload('pdf')}
        >
          {busyKind === 'pdf' ? 'Preparing…' : 'Download PDF plan'}
        </Button>
      </div>
    </div>
  )
}

/**
 * The client view of a lesson: the public detail information without the
 * marketing extras, plus downloads and the folder assignment.
 */
export function MaterialDetailPage() {
  const { slug = '' } = useParams()
  // Bumped after a folder assign so the detail and folder list refetch.
  const [version, setVersion] = useState(0)

  const state = useAsync(
    (signal) => materialsService.detail(slug, signal),
    [slug, version],
  )
  const foldersState = useAsync(
    (signal) => materialsService.folders(signal),
    [version],
  )

  const refresh = () => setVersion((current) => current + 1)

  return (
    <>
      <Link
        to={APP_ROUTES.APP}
        className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
      >
        ← Back to materials
      </Link>

      <div className="mt-6">
        <AsyncSection
          state={state}
          isEmpty={() => false}
          skeleton={
            <div className="grid gap-10 lg:grid-cols-[2fr_1fr]" aria-hidden="true">
              <div className="h-96 animate-pulse rounded-xl bg-accent-100" />
              <div className="h-64 animate-pulse rounded-xl bg-accent-100" />
            </div>
          }
        >
          {(material) => (
            <article className="grid gap-10 lg:grid-cols-[2fr_1fr]">
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    material.access === 'free'
                      ? 'bg-accent-200 text-accent-800'
                      : 'bg-ink/10 text-ink-soft'
                  }`}
                >
                  {material.access === 'free' ? 'Free' : 'Paid'}
                </span>

                <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-ink">
                  {material.title}
                </h1>

                {material.imageUrl ? (
                  <img
                    src={material.imageUrl}
                    alt={material.title}
                    className="mt-6 aspect-video w-full rounded-xl object-cover"
                  />
                ) : (
                  <Placeholder
                    label="Photo"
                    className="mt-6 aspect-video w-full rounded-xl"
                  />
                )}

                <section className="mt-8">
                  <h2 className="font-heading text-lg font-bold text-ink">
                    About this lesson
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {material.description}
                  </p>
                </section>

                <section className="mt-6">
                  <h2 className="font-heading text-lg font-bold text-ink">
                    Objectives
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {material.objectives}
                  </p>
                </section>

                <section className="mt-6">
                  <h2 className="font-heading text-lg font-bold text-ink">
                    Summary
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {material.summary}
                  </p>
                </section>
              </div>

              <aside className="space-y-4">
                <div className="rounded-xl border border-ink/10 bg-white p-5">
                  {/* The level band carries its own colour, managed from admin Taxonomy. */}
                  <div
                    className="rounded-md px-2.5 py-1.5 text-xs font-semibold"
                    style={{
                      backgroundColor: material.level.color,
                      color: material.level.textColor,
                    }}
                  >
                    {material.level.name}
                    <span className="ml-1 font-normal opacity-80">
                      ({material.level.cefr.join('/')})
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 text-sm text-ink-soft">
                    <div className="flex gap-1.5">
                      <dt className="font-medium text-ink">Category:</dt>
                      <dd>{material.category.name}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-medium text-ink">Topic:</dt>
                      <dd>{material.topic.name}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-medium text-ink">Date:</dt>
                      <dd>{formatDate(material.publishedAt)}</dd>
                    </div>
                  </dl>
                </div>

                <DownloadsCard material={material} />

                <div className="rounded-xl border border-ink/10 bg-white p-5">
                  <FolderSelect
                    lessonId={material.id}
                    folderId={material.folderId}
                    folders={foldersState.data?.folders ?? []}
                    onAssigned={refresh}
                    label="Folder:"
                  />
                </div>
              </aside>
            </article>
          )}
        </AsyncSection>
      </div>
    </>
  )
}
