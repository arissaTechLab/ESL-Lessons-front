import { useState } from 'react'
import { AsyncSection, Pagination } from '@/shared/components'
import { useAsync } from '@/hooks'
import { MetricCard } from '@/features/admin-dashboard'
import { PaypalCard, LineChart } from '@/features/admin-revenue/components'
import { adminRevenueService } from '@/features/admin-revenue/services/admin-revenue.service'
import type {
  Transaction,
  TransactionPlan,
  TransactionStatus,
} from '@/features/admin-revenue/types/admin-revenue.types'

const PAGE_SIZE = 10

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const count = new Intl.NumberFormat('en-US')

function formatAmount(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
  failed: 'Failed',
}

const STATUS_BADGES: Record<TransactionStatus, string> = {
  paid: 'bg-accent-200 text-accent-800',
  pending: 'bg-brand-100 text-brand-800',
  refunded: 'bg-ink/10 text-ink-soft',
  failed: 'bg-red-100 text-red-700',
}

const PLAN_LABELS: Record<TransactionPlan, string> = {
  '6-months': '6 months',
  '12-months': '12 months',
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

const SELECT_CLASSES =
  'rounded-lg border border-ink/15 bg-white py-2 pl-3 pr-8 text-sm text-ink transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

function TransactionsTable({ rows }: { rows: Transaction[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-muted">
            <th scope="col" className="py-2.5 pr-4 font-semibold">Date</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Client</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Plan</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Amount</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Status</th>
            <th scope="col" className="py-2.5 font-semibold">PayPal reference</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-ink/5 last:border-b-0">
              <td className="whitespace-nowrap py-3 pr-4 text-ink-soft">
                {formatDate(row.paidAt)}
              </td>
              <td className="py-3 pr-4">
                {row.user ? (
                  <>
                    <p className="font-medium text-ink">{row.user.name}</p>
                    <p className="text-xs text-ink-muted">{row.user.email}</p>
                  </>
                ) : (
                  <span className="text-ink-muted">—</span>
                )}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-ink-soft">
                {PLAN_LABELS[row.plan]}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 font-medium tabular-nums text-ink">
                {formatAmount(row.amount, row.currency)}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-3">
                {row.reference ? (
                  <span className="font-mono text-xs text-ink-soft">
                    {row.reference}
                  </span>
                ) : (
                  <span className="text-ink-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Admin revenue (guide 6.6): PayPal, headline figures, chart, transactions. */
export function AdminRevenuePage() {
  // Bumped after a PayPal connect/disconnect so the overview refetches.
  const [refreshKey, setRefreshKey] = useState(0)
  const overviewState = useAsync(
    (signal) => adminRevenueService.overview(signal),
    [refreshKey],
  )

  const [status, setStatus] = useState<TransactionStatus | ''>('')
  const [plan, setPlan] = useState<TransactionPlan | ''>('')
  const [page, setPage] = useState(1)
  const transactionsState = useAsync(
    (signal) =>
      adminRevenueService.transactions(
        {
          status: status === '' ? undefined : status,
          plan: plan === '' ? undefined : plan,
          page,
          limit: PAGE_SIZE,
        },
        signal,
      ),
    [status, plan, page],
  )

  return (
    <>
      <header>
        <h1 className="font-heading text-2xl font-bold text-ink">Revenue</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Subscriptions income and payment history.
        </p>
      </header>

      <div className="mt-6 space-y-6">
        <AsyncSection
          state={overviewState}
          isEmpty={() => false}
          skeleton={
            <div className="space-y-6" aria-hidden="true">
              <div className="h-24 animate-pulse rounded-xl bg-accent-100" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl bg-accent-100"
                  />
                ))}
              </div>
              <div className="h-72 animate-pulse rounded-xl bg-accent-100" />
            </div>
          }
        >
          {(data) => (
            <>
              <PaypalCard
                paypal={data.paypal}
                onChanged={() => setRefreshKey((key) => key + 1)}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Total revenue"
                  value={money.format(data.metrics.totalRevenue)}
                />
                <MetricCard
                  label="This month"
                  value={money.format(data.metrics.revenueThisMonth)}
                />
                <MetricCard
                  label="Active subscriptions"
                  value={count.format(data.metrics.activeSubscriptions)}
                />
                <MetricCard
                  label="MRR"
                  value={money.format(data.metrics.mrr)}
                  delta="monthly recurring revenue"
                />
              </div>

              <section className="rounded-xl border border-ink/10 bg-white p-5">
                <h2 className="font-heading text-lg font-bold text-ink">
                  Revenue — last 12 months
                </h2>
                <div className="mt-4">
                  <LineChart
                    data={data.chart}
                    title="Revenue over the last 12 months"
                    description="Line chart of monthly subscription revenue in US dollars."
                  />
                </div>
              </section>
            </>
          )}
        </AsyncSection>

        <section className="rounded-xl border border-ink/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-ink">
              Transactions
            </h2>
            <div className="flex flex-wrap gap-2">
              <label>
                <span className="sr-only">Filter by status</span>
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as TransactionStatus | '')
                    setPage(1)
                  }}
                  className={SELECT_CLASSES}
                >
                  <option value="">All statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </label>
              <label>
                <span className="sr-only">Filter by plan</span>
                <select
                  value={plan}
                  onChange={(event) => {
                    setPlan(event.target.value as TransactionPlan | '')
                    setPage(1)
                  }}
                  className={SELECT_CLASSES}
                >
                  <option value="">All plans</option>
                  <option value="6-months">6 months</option>
                  <option value="12-months">12 months</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <AsyncSection
              state={transactionsState}
              isEmpty={(data) => data.items.length === 0}
              skeleton={
                <div className="space-y-2" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-lg bg-accent-100"
                    />
                  ))}
                </div>
              }
              empty={
                <p className="py-6 text-center text-sm text-ink-muted">
                  No transactions match these filters.
                </p>
              }
            >
              {(data) => (
                <>
                  <TransactionsTable rows={data.items} />
                  <Pagination
                    page={data.page}
                    pages={data.pages}
                    onChange={setPage}
                  />
                </>
              )}
            </AsyncSection>
          </div>
        </section>
      </div>
    </>
  )
}
