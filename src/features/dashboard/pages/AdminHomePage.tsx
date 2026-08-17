import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { ZoneShell } from '@/features/dashboard/components'
import { dashboardService } from '@/features/dashboard/services/dashboard.service'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-extrabold text-ink">{value}</p>
    </div>
  )
}

/**
 * Admin overview. The full panel (Lessons, Taxonomy, Blog, Clients, Revenue)
 * is still to be built — this renders the live dashboard metrics.
 */
export function AdminHomePage() {
  const state = useAsync((signal) => dashboardService.adminOverview(signal), [])

  return (
    <ZoneShell title="Dashboard" subtitle="How the business is doing right now.">
      <AsyncSection state={state} isEmpty={() => false}>
        {(data) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Slides downloads"
                value={String(data.metrics.slidesDownloads)}
              />
              <MetricCard
                label="PDF plans downloaded"
                value={String(data.metrics.pdfDownloads)}
              />
              <MetricCard
                label="Active subscriptions"
                value={`${data.metrics.activeSubscriptions} / ${data.metrics.totalClients}`}
              />
              <MetricCard
                label="Total revenue"
                value={currency.format(data.metrics.totalRevenue)}
              />
            </div>

            <section className="mt-10">
              <h2 className="font-heading text-lg font-bold text-ink">
                Most downloaded lessons
              </h2>

              {data.topLessons.length === 0 ? (
                <p className="mt-4 text-sm text-ink-muted">
                  No downloads recorded yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.topLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <div className="flex items-center justify-between text-sm text-ink">
                        <span>{lesson.title}</span>
                        <span className="text-ink-muted">{lesson.downloads}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-accent-100">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${lesson.percentage}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </AsyncSection>
    </ZoneShell>
  )
}
