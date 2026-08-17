import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { MetricCard, BarChart } from '@/features/admin-dashboard/components'
import { adminDashboardService } from '@/features/admin-dashboard/services/admin-dashboard.service'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const count = new Intl.NumberFormat('en-US')

function Skeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-accent-100" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl bg-accent-100" />
      <div className="h-56 animate-pulse rounded-xl bg-accent-100" />
    </div>
  )
}

/** Admin overview (guide 6.1): headline metrics, downloads chart, top lessons. */
export function AdminDashboardPage() {
  const state = useAsync((signal) => adminDashboardService.overview(signal), [])

  return (
    <>
      <header>
        <h1 className="font-heading text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">
          How the business is doing right now.
        </p>
      </header>

      <div className="mt-6">
        <AsyncSection state={state} skeleton={<Skeleton />} isEmpty={() => false}>
          {(data) => {
            const growth = data.metrics.revenueGrowthThisMonth

            return (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Slides downloads"
                    value={count.format(data.metrics.slidesDownloads)}
                  />
                  <MetricCard
                    label="PDF plans downloaded"
                    value={count.format(data.metrics.pdfDownloads)}
                  />
                  <MetricCard
                    label="Active subscriptions"
                    value={`${count.format(data.metrics.activeSubscriptions)} / ${count.format(data.metrics.totalClients)}`}
                    delta="active / total clients"
                  />
                  <MetricCard
                    label="Total revenue"
                    value={currency.format(data.metrics.totalRevenue)}
                    delta={`${growth > 0 ? '+' : ''}${growth}% this month`}
                    deltaTone={
                      growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral'
                    }
                  />
                </div>

                <section className="rounded-xl border border-ink/10 bg-white p-5">
                  <h2 className="font-heading text-lg font-bold text-ink">
                    Downloads — last 6 months
                  </h2>
                  <div className="mt-4">
                    <BarChart
                      data={data.downloadsChart}
                      title="Downloads over the last 6 months"
                      description="Grouped bar chart comparing Google Slides and PDF plan downloads per month."
                    />
                  </div>
                </section>

                <section className="rounded-xl border border-ink/10 bg-white p-5">
                  <h2 className="font-heading text-lg font-bold text-ink">
                    Most downloaded lessons
                  </h2>

                  {data.topLessons.length === 0 ? (
                    <p className="mt-4 text-sm text-ink-muted">
                      No downloads recorded yet.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-4">
                      {data.topLessons.map((lesson) => (
                        <li key={lesson.id}>
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="truncate text-ink">{lesson.title}</span>
                            <span className="shrink-0 text-ink-muted">
                              {count.format(lesson.downloads)}{' '}
                              {lesson.downloads === 1 ? 'download' : 'downloads'}
                            </span>
                          </div>
                          <div
                            className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-100"
                            role="progressbar"
                            aria-label={`${lesson.title} — ${lesson.percentage}% of the top lesson's downloads`}
                            aria-valuenow={lesson.percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-brand-600"
                              // Width is data-driven; everything else is utilities.
                              style={{ width: `${lesson.percentage}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )
          }}
        </AsyncSection>
      </div>
    </>
  )
}
