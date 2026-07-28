import type { GrammarEntry } from '../types/grammar.types'

export function GrammarTable({ entries }: { entries: readonly GrammarEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink/20 py-16 text-center">
        <p className="text-ink-soft">No grammar points match your search.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/15">
            <th className="w-3/5 pb-3 pr-6 font-heading text-sm font-semibold uppercase tracking-wide text-accent-600">
              Grammar Point
            </th>
            <th className="pb-3 font-heading text-sm font-semibold uppercase tracking-wide text-accent-600">
              Lesson Link
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-ink/10">
              <td className="py-4 pr-6 align-top">
                <p className="text-sm text-ink-soft">{entry.point}</p>
              </td>
              <td className="py-4 align-top">
                <div className="flex flex-col gap-3">
                  {entry.links.map((link, index) => (
                    <a
                      key={`${entry.id}-${index}`}
                      href={link.href}
                      className="text-sm text-brand-600 transition hover:text-brand-700"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
