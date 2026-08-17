import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AsyncSection, PageHeader } from '@/shared/components'
import { useAsync } from '@/hooks'
import { APP_ROUTES, path } from '@/config/routes.constants'
import { grammarService } from '@/features/grammar/services/grammar.service'
import type { GrammarPoint } from '@/features/grammar/types/grammar.types'

/** The levels the library actually covers — the only filterable codes. */
const CEFR_OPTIONS = ['B1', 'B2', 'C1'] as const

function CefrBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex rounded-full bg-accent-200 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
      {code}
    </span>
  )
}

function GrammarTable({ rows }: { rows: GrammarPoint[] }) {
  const ordered = [...rows].sort((a, b) => a.order - b.order)

  return (
    // Own scroll container so the table never forces the page to scroll sideways.
    <div className="overflow-x-auto rounded-xl border border-ink/10 bg-cream">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-accent-100 text-xs uppercase tracking-wide text-ink-soft">
            <th scope="col" className="px-4 py-3 font-semibold">
              Grammar point
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Level
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Lessons
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {ordered.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-4 py-3 font-heading font-semibold text-ink">
                {row.title}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {row.cefr.map((code) => (
                    <CefrBadge key={code} code={code} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                {row.lessons.length === 0 ? (
                  <span className="text-ink-muted">No lessons yet</span>
                ) : (
                  <ul className="space-y-1">
                    {row.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          to={path(APP_ROUTES.LESSON_DETAIL, {
                            slug: lesson.slug,
                          })}
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GrammarIndexPage() {
  const [selected, setSelected] = useState<string[]>([])

  const state = useAsync(
    (signal) => grammarService.list(selected, signal),
    [selected.join(',')],
  )

  const toggle = (code: string) =>
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )

  return (
    <>
      <PageHeader
        title="Grammar index"
        subtitle="Every grammar point covered in the library, with the lessons that put it into real conversation."
      />

      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div
            role="group"
            aria-label="Filter by CEFR level"
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="text-sm font-medium text-ink-soft">
              Filter by level:
            </span>
            {CEFR_OPTIONS.map((code) => {
              const isActive = selected.includes(code)
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggle(code)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-ink/25 text-ink-soft hover:bg-ink/5'
                  }`}
                >
                  {code}
                </button>
              )
            })}
          </div>

          <AsyncSection
            state={state}
            skeleton={
              <div className="space-y-3" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-accent-100"
                  />
                ))}
              </div>
            }
            empty={
              <p className="py-6 text-center text-sm text-ink-muted">
                {selected.length > 0
                  ? 'No grammar points match the selected levels — try removing a filter.'
                  : 'No grammar points published yet.'}
              </p>
            }
          >
            {(rows) => <GrammarTable rows={rows} />}
          </AsyncSection>
        </div>
      </section>
    </>
  )
}
