import { useAsync } from '@/hooks'
import { AsyncSection } from '@/shared/components'
import { contentService } from '../services/content.service'

function StatsSkeleton() {
  return (
    <div className="grid gap-10 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex flex-col items-center text-center">
          <span className="size-16 animate-pulse rounded-full bg-accent-200" />
          <span className="mt-4 h-10 w-20 animate-pulse rounded-md bg-accent-200" />
          <span className="mt-2 h-4 w-40 animate-pulse rounded-md bg-accent-200" />
        </div>
      ))}
    </div>
  )
}

export function StatsSection() {
  const state = useAsync((signal) => contentService.stats(signal))

  return (
    <section className="bg-accent-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <AsyncSection state={state} skeleton={<StatsSkeleton />}>
          {(stats) => (
            <div className="grid gap-10 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col items-center text-center"
                >
                  <span className="grid size-16 place-items-center rounded-full border-2 border-brand-600 text-brand-600">
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
                      {stat.icon.map((d) => (
                        <path key={d} d={d} />
                      ))}
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
