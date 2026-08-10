import { useMemo, useState } from 'react'
import { buttonVariants } from '@/shared/components'
import { AdminPageHeader, StatTile } from '@/features/admin/components'
import { CLIENTS, type SubscriptionPlan } from '@/features/clients'
import {
  TRANSACTIONS,
  formatMoney,
  formatTransactionDate,
  getMonthlyRevenue,
  type Transaction,
} from '@/features/revenue'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

/** Rough monthly value of each plan (for MRR). */
const PLAN_MONTHLY: Record<SubscriptionPlan, number> = {
  '6-month': 72 / 6,
  '12-month': 112 / 12,
}

const STATUS_STYLES: Record<Transaction['status'], string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  refunded: 'bg-amber-100 text-amber-800',
  failed: 'bg-rose-100 text-rose-800',
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

function PaypalCard() {
  const [connected, setConnected] = useState(false)
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
            {connected
              ? 'Connected — subscription payments sync automatically.'
              : 'Connect your PayPal account to sync subscription payments.'}
          </p>
        </div>
      </div>
      {connected ? (
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:self-auto">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConnected(true)}
          className={buttonVariants('secondary', 'sm')}
        >
          Connect PayPal
        </button>
      )}
    </div>
  )
}

function RevenueChart() {
  const monthly = useMemo(() => getMonthlyRevenue(), [])
  const max = Math.max(...monthly.map((m) => m.total), 1)

  return (
    <div className="mb-6 rounded-xl border border-ink/10 bg-white p-5">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Revenue by month
      </h2>
      <div className="mt-5 flex h-52 items-stretch gap-3">
        {monthly.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center">
            <span className="mb-1 text-[10px] font-semibold text-ink-soft">
              ${Math.round(m.total)}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t bg-brand-400"
                style={{ height: `${(m.total / max) * 100}%` }}
                title={`${m.label}: ${formatMoney(m.total)}`}
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
  const stats = useMemo(() => {
    const paid = TRANSACTIONS.filter((t) => t.status === 'paid')
    const total = paid.reduce((sum, t) => sum + t.amount, 0)
    const monthly = getMonthlyRevenue()
    const thisMonth = monthly.at(-1)?.total ?? 0

    const activeClients = CLIENTS.filter((c) => c.status === 'active')
    const mrr = activeClients.reduce(
      (sum, c) => sum + (c.plan ? PLAN_MONTHLY[c.plan] : 0),
      0,
    )

    return {
      total,
      thisMonth,
      activeSubs: activeClients.length,
      mrr,
    }
  }, [])

  return (
    <>
      <AdminPageHeader
        title="Revenue"
        description="Subscription income synced from PayPal, at a glance."
      />

      <PaypalCard />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total revenue" value={formatMoney(stats.total)} />
        <StatTile label="This month" value={formatMoney(stats.thisMonth)} />
        <StatTile label="Active subscriptions" value={stats.activeSubs} />
        <StatTile label="MRR (est.)" value={formatMoney(stats.mrr)} />
      </div>

      <RevenueChart />

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
        <div className="border-b border-ink/10 px-4 py-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
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
              {[...TRANSACTIONS]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                  >
                    <td className={TD}>{formatTransactionDate(txn.date)}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {txn.clientName}
                    </td>
                    <td className={TD}>{txn.plan}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {formatMoney(txn.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                      {txn.paypalRef}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
