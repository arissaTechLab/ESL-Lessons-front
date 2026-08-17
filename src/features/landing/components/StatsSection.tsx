import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { contentService } from '@/features/landing/services/content.service'

/** Headline business figures, editable from the admin panel. */
export function StatsSection() {
  const state = useAsync((signal) => contentService.stats(signal), [])

  return (
    <section className="bg-accent-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <AsyncSection
          state={state}
          skeleton={
            <div className="grid gap-10 sm:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="mx-auto h-32 w-40 animate-pulse rounded-xl bg-accent-200"
                />
              ))}
            </div>
          }
          empty={null}
        >
          {(stats) => (
            <div className="grid gap-10 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col items-center text-center"
                >
                  <span className="grid size-16 place-items-center rounded-full border-2 border-ink/20 text-ink">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={stat.icon} />
                    </svg>
                  </span>
                  <p className="mt-4 font-heading text-4xl font-extrabold text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </AsyncSection>
      </div>
    </section>
  )
}
