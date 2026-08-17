import { useEffect, useState } from 'react'
import { AsyncSection, Pagination, SearchInput } from '@/shared/components'
import { useAsync } from '@/hooks'
import { adminClientsService } from '@/features/admin-clients/services/admin-clients.service'
import type {
  ClientPlan,
  ClientStatus,
} from '@/features/admin-clients/types/admin-clients.types'

const PLAN_LABELS: Record<ClientPlan, string> = {
  '6-months': '6 months',
  '12-months': '12 months',
}

const STATUS_BADGES: Record<ClientStatus, { label: string; classes: string }> =
  {
    active: { label: 'Active', classes: 'bg-accent-200 text-accent-800' },
    expired: { label: 'Expired', classes: 'bg-amber-100 text-amber-800' },
    free: { label: 'Free', classes: 'bg-ink/10 text-ink-soft' },
  }

const SELECT =
  'rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

const HEADER_CELL =
  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-extrabold text-ink">
        {value}
      </p>
    </div>
  )
}

function TilesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-accent-100" />
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div
      className="h-80 animate-pulse rounded-xl bg-accent-100"
      aria-hidden="true"
    />
  )
}

/** Read-only clients overview: summary tiles, filters and the accounts table. */
export function AdminClientsPage() {
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [plan, setPlan] = useState<'' | ClientPlan>('')
  const [status, setStatus] = useState<'' | ClientStatus>('')
  const [page, setPage] = useState(1)

  // Debounce so the table doesn't refetch on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q.trim()), 300)
    return () => clearTimeout(timer)
  }, [q])

  const state = useAsync(
    (signal) =>
      adminClientsService.list(
        {
          q: debouncedQ || undefined,
          plan: plan || undefined,
          status: status || undefined,
          page,
        },
        signal,
      ),
    [debouncedQ, plan, status, page],
  )

  const hasFilters = Boolean(debouncedQ || plan || status)
  const resetPage = () => setPage(1)

  return (
    <>
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Clients</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every registered account and its subscription.
        </p>
      </div>

      {/* Tiles and table read the same response. The tiles section hides on
          error so the failure message (below) only renders once. */}
      <div className="mt-6">
        {!state.error && (
          <AsyncSection
            state={state}
            skeleton={<TilesSkeleton />}
            isEmpty={() => false}
          >
            {(data) => (
              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryTile
                  label="Total clients"
                  value={data.summary.totalClients}
                />
                <SummaryTile
                  label="Active subscriptions"
                  value={data.summary.activeSubscriptions}
                />
                <SummaryTile
                  label="Free accounts"
                  value={data.summary.freeAccounts}
                />
              </div>
            )}
          </AsyncSection>
        )}
      </div>

      {/* Filters stay outside the async block so the search box keeps focus
          while a refetch is in flight. */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput
          value={q}
          onChange={(value) => {
            setQ(value)
            resetPage()
          }}
          placeholder="Search by name or email…"
          className="w-full max-w-sm"
        />
        <label>
          <span className="sr-only">Filter by plan</span>
          <select
            value={plan}
            onChange={(event) => {
              setPlan(event.target.value as '' | ClientPlan)
              resetPage()
            }}
            className={SELECT}
          >
            <option value="">All plans</option>
            <option value="6-months">6 months</option>
            <option value="12-months">12 months</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as '' | ClientStatus)
              resetPage()
            }}
            className={SELECT}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="free">Free</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <AsyncSection
          state={state}
          skeleton={<TableSkeleton />}
          isEmpty={(data) => data.items.length === 0}
          empty={
            <p className="rounded-xl border border-ink/10 bg-white py-10 text-center text-sm text-ink-muted">
              {hasFilters
                ? 'No clients match your filters.'
                : 'No clients yet.'}
            </p>
          }
        >
          {(data) => (
            <>
              <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
                <table className="w-full min-w-[48rem] text-sm">
                  <thead className="border-b border-ink/10">
                    <tr>
                      <th className={HEADER_CELL}>Name</th>
                      <th className={HEADER_CELL}>Email</th>
                      <th className={HEADER_CELL}>Registered</th>
                      <th className={HEADER_CELL}>Plan</th>
                      <th className={HEADER_CELL}>Status</th>
                      <th className={HEADER_CELL}>Renewal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {data.items.map((client) => {
                      const badge = STATUS_BADGES[client.status]

                      return (
                        <tr key={client.id}>
                          <td className="px-4 py-3 font-medium text-ink">
                            {client.fullName}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {client.email}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {formatDate(client.registeredAt)}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {client.plan ? PLAN_LABELS[client.plan] : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge.classes}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {client.renewsAt
                              ? formatDate(client.renewsAt)
                              : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={data.page}
                pages={data.pages}
                onChange={setPage}
              />
            </>
          )}
        </AsyncSection>
      </div>
    </>
  )
}
