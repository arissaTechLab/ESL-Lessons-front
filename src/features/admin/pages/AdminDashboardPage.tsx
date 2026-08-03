import { useMemo, type ReactNode } from 'react'
import { AdminPageHeader } from '@/features/admin/components'
import { CLIENTS } from '@/features/clients'
import { TRANSACTIONS, formatMoney, getMonthlyRevenue } from '@/features/revenue'
import {
  DOWNLOADS_MONTHLY,
  TOP_DOWNLOADED_LESSONS,
} from '@/features/admin/data/dashboard'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string
  delta?: string
  direction?: 'up' | 'down' | 'neutral'
}

function MetricCard({
  icon,
  label,
  value,
  delta,
  direction = 'neutral',
}: MetricCardProps) {
  const deltaColor =
    direction === 'up'
      ? 'text-emerald-600'
      : direction === 'down'
        ? 'text-rose-600'
        : 'text-ink-muted'
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
          {icon}
        </span>
        {delta && (
          <span className={`text-xs font-semibold ${deltaColor}`}>{delta}</span>
        )}
      </div>
      <p className="mt-4 font-heading text-2xl font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-sm text-ink-soft">{label}</p>
    </div>
  )
}

function pct(current: number, previous: number): number {
  if (!previous) return 0
  return Math.round(((current - previous) / previous) * 100)
}

function DownloadsChart() {
  const max = Math.max(
    ...DOWNLOADS_MONTHLY.flatMap((m) => [m.slides, m.pdf]),
    1,
  )
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Downloads · last 6 months
        </h2>
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-brand-400" />
            Slides
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-accent-500" />
            PDF plans
          </span>
        </div>
      </div>
      <div className="mt-6 flex h-52 items-end gap-4">
        {DOWNLOADS_MONTHLY.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center">
            <div className="flex w-full flex-1 items-end justify-center gap-1">
              <div
                className="w-1/3 rounded-t bg-brand-400"
                style={{ height: `${(m.slides / max) * 100}%` }}
                title={`Slides: ${m.slides}`}
              />
              <div
                className="w-1/3 rounded-t bg-accent-500"
                style={{ height: `${(m.pdf / max) * 100}%` }}
                title={`PDF: ${m.pdf}`}
              />
            </div>
            <span className="mt-2 text-xs text-ink-muted">{m.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopLessonsPanel() {
  const max = Math.max(...TOP_DOWNLOADED_LESSONS.map((l) => l.downloads), 1)
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Most downloaded lessons
      </h2>
      <ul className="mt-4 space-y-3.5">
        {TOP_DOWNLOADED_LESSONS.map((lesson) => (
          <li key={lesson.title}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate text-ink">{lesson.title}</span>
              <span className="shrink-0 font-semibold text-ink-soft">
                {lesson.downloads}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-brand-400"
                style={{ width: `${(lesson.downloads / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AdminDashboardPage() {
  const metrics = useMemo(() => {
    const slidesTotal = DOWNLOADS_MONTHLY.reduce((s, m) => s + m.slides, 0)
    const pdfTotal = DOWNLOADS_MONTHLY.reduce((s, m) => s + m.pdf, 0)

    const n = DOWNLOADS_MONTHLY.length
    const cur = DOWNLOADS_MONTHLY[n - 1]
    const prev = DOWNLOADS_MONTHLY[n - 2]
    const slidesDelta = cur && prev ? pct(cur.slides, prev.slides) : 0
    const pdfDelta = cur && prev ? pct(cur.pdf, prev.pdf) : 0

    const revenueTotal = TRANSACTIONS.filter((t) => t.status === 'paid').reduce(
      (s, t) => s + t.amount,
      0,
    )
    const monthly = getMonthlyRevenue()
    const revenueThisMonth = monthly[monthly.length - 1]?.total ?? 0

    return {
      slidesTotal,
      pdfTotal,
      slidesDelta,
      pdfDelta,
      revenueTotal,
      revenueThisMonth,
      activeSubs: CLIENTS.filter((c) => c.status === 'active').length,
      totalClients: CLIENTS.length,
    }
  }, [])

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="How your lessons and subscriptions are performing."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={
            <Icon>
              <rect x="3" y="4" width="18" height="12" rx="1" />
              <path d="M12 16v4M8 20h8" />
            </Icon>
          }
          label="Google Slides downloads"
          value={metrics.slidesTotal.toLocaleString('en-US')}
          delta={`+${metrics.slidesDelta}% vs last month`}
          direction="up"
        />
        <MetricCard
          icon={
            <Icon>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </Icon>
          }
          label="PDF lesson plans downloaded"
          value={metrics.pdfTotal.toLocaleString('en-US')}
          delta={`+${metrics.pdfDelta}% vs last month`}
          direction="up"
        />
        <MetricCard
          icon={
            <Icon>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            </Icon>
          }
          label="Active subscriptions"
          value={String(metrics.activeSubs)}
          delta={`of ${metrics.totalClients} total clients`}
          direction="neutral"
        />
        <MetricCard
          icon={
            <Icon>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </Icon>
          }
          label="Total revenue"
          value={formatMoney(metrics.revenueTotal)}
          delta={`+${formatMoney(metrics.revenueThisMonth)} this month`}
          direction="up"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <DownloadsChart />
        <TopLessonsPanel />
      </div>
    </>
  )
}
