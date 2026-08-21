import { useState } from 'react'
import { useAsync } from '@/hooks'
import { AsyncSection, buttonVariants } from '@/shared/components'
import { AdminPageHeader, StatTile } from '@/features/admin/components'
import { planLabel } from '@/features/clients'
import {
  formatMoney,
  formatTransactionDate,
  type Transaction,
} from '@/features/revenue'
import {
  adminReportsService,
  type RevenueOverview,
} from '@/features/admin/services/admin-reports.service'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

const STATUS_STYLES: Record<Transaction['status'], string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  refunded: 'bg-amber-100 text-amber-800',
  failed: 'bg-rose-100 text-rose-800',
  pending: 'bg-ink/10 text-ink-soft',
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}

function PaypalCard({
  paypal,
  onChange,
}: {
  paypal: RevenueOverview['paypal']
  onChange: () => void
}) {
  const [busy, setBusy] = useState(false)

  const connect = () => {
    const accountEmail = window
      .prompt('PayPal account email to connect:')
      ?.trim()
    if (!accountEmail) return
    setBusy(true)
    adminReportsService
      .connectPaypal(accountEmail)
      .then(onChange)
      .catch(onChange)
      .finally(() => setBusy(false))
  }

  const disconnect = () => {
    setBusy(true)
    adminReportsService
      .disconnectPaypal()
      .then(onChange)
      .catch(onChange)
      .finally(() => setBusy(false))
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-[#003087] text-white">
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <path d="M7 3h7c3 0 5 2 4.5 5-.5 3-3 4.5-6 4.5H9.8L9 17H6L7 3Zm2.6 4-.4 3h2c1.3 0 2.3-.6 2.5-2 .2-1-.4-1.6-1.5-1.6H9.6Z" />
            <path d="M4 6h6.5c2.7 0 4.3 1.6 3.9 4.2-.4 2.6-2.6 4-5.3 4H6.8L6 19H3L4 6Z" opacity=".55" />
          </svg>
        </span>
        <div>
          <p className="font-semibold text-ink">PayPal</p>
          <p className="text-sm text-ink-soft">
            {paypal.connected
              ? `Connected as ${paypal.accountEmail ?? '—'} — subscription payments sync automatically.`
              : 'Connect your PayPal account to sync subscription payments.'}
          </p>
        </div>
      </div>
      {paypal.connected ? (
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
          <button
            type="button"
            onClick={disconnect}
            disabled={busy}
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          disabled={busy}
          className={buttonVariants('secondary', 'sm')}
        >
          Connect PayPal
        </button>
      )}
    </div>
  )
}

function RevenueChart({ chart }: { chart: RevenueOverview['chart'] }) {
  const max = Math.max(...chart.map((m) => m.revenue), 1)

  return (
    <div className="mb-6 rounded-xl border border-ink/10 bg-white p-5">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Revenue by month
      </h2>
      <div className="mt-5 flex h-52 items-stretch gap-3">
        {chart.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center">
            <span className="mb-1 text-[10px] font-semibold text-ink-soft">
              ${Math.round(m.revenue)}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t bg-brand-400"
                style={{ height: `${(m.revenue / max) * 100}%` }}
                title={`${m.label}: ${formatMoney(m.revenue)}`}
              />
            </div>
            <span className="mt-2 text-xs text-ink-muted">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminRevenuePage() {
  // Bumped after connecting/disconnecting PayPal to refetch the overview.
  const [version, setVersion] = useState(0)
  const [page, setPage] = useState(1)

  const overviewState = useAsync(
    (signal) => adminReportsService.revenue(signal),
    [version],
  )
  const transactionsState = useAsync(
    (signal) => adminReportsService.transactions({ page }, signal),
    [page],
  )

  return (
    <>
      <AdminPageHeader
        title="Revenue"
        description="Subscription income synced from PayPal, at a glance."
      />

      <AsyncSection state={overviewState} isEmpty={() => false}>
        {(overview) => (
          <>
            <PaypalCard
              paypal={overview.paypal}
              onChange={() => setVersion((v) => v + 1)}
            />

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Total revenue"
                value={formatMoney(overview.metrics.totalRevenue)}
              />
              <StatTile
                label="This month"
                value={formatMoney(overview.metrics.revenueThisMonth)}
              />
              <StatTile
                label="Active subscriptions"
                value={overview.metrics.activeSubscriptions}
              />
              <StatTile
                label="MRR (est.)"
                value={formatMoney(overview.metrics.mrr)}
              />
            </div>

            <RevenueChart chart={overview.chart} />
          </>
        )}
      </AsyncSection>

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
        <div className="border-b border-ink/10 px-4 py-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <AsyncSection
            state={transactionsState}
            skeleton={
              <div
                className="m-4 h-40 animate-pulse rounded-lg bg-accent-100"
                aria-hidden="true"
              />
            }
            isEmpty={(data) => data.items.length === 0}
            empty={
              <p className="px-4 py-12 text-center text-sm text-ink-muted">
                No transactions yet.
              </p>
            }
          >
            {(data) => (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink/10 bg-cream/60 text-xs uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className={TH}>Date</th>
                    <th className={TH}>Client</th>
                    <th className={TH}>Plan</th>
                    <th className={TH}>Amount</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>PayPal ref</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                    >
                      <td className={TD}>
                        {txn.paidAt ? formatTransactionDate(txn.paidAt) : '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {txn.user?.name ?? '—'}
                      </td>
                      <td className={TD}>{planLabel(txn.plan)}</td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {formatMoney(txn.amount, txn.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={txn.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                        {txn.reference ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </AsyncSection>
        </div>
      </div>

      {transactionsState.data && transactionsState.data.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-soft">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={transactionsState.data.page <= 1}
            className="rounded-lg border border-ink/20 px-3 py-1.5 font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {transactionsState.data.page} of {transactionsState.data.pages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((p) =>
                Math.min(transactionsState.data?.pages ?? p, p + 1),
              )
            }
            disabled={transactionsState.data.page >= transactionsState.data.pages}
            className="rounded-lg border border-ink/20 px-3 py-1.5 font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
