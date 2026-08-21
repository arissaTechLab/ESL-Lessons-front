import { useEffect, useState } from 'react'
import { useAsync } from '@/hooks'
import { AsyncSection, SortDropdown } from '@/shared/components'
import { AdminPageHeader, StatTile } from '@/features/admin/components'
import {
  planLabel,
  formatClientDate,
  type Client,
  type ClientStatus,
  type SubscriptionPlan,
} from '@/features/clients'
import { adminReportsService } from '@/features/admin/services/admin-reports.service'

const TH = 'px-4 py-3 font-semibold'
const TD = 'px-4 py-3 text-ink-soft'

const PLAN_FILTER_OPTIONS = [
  { value: 'all', label: 'All plans' },
  { value: '6-months', label: 'The Semester Pass' },
  { value: '12-months', label: 'The Annual Pass' },
  { value: 'none', label: 'No plan' },
] as const

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'free', label: 'Free' },
] as const

const STATUS_STYLES: Record<Client['status'], string> = {
  active: 'bg-emerald-100 text-emerald-800',
  expired: 'bg-rose-100 text-rose-800',
  free: 'bg-ink/10 text-ink-soft',
}

const STATUS_LABELS: Record<Client['status'], string> = {
  active: 'Active',
  expired: 'Expired',
  free: 'Free',
}

function StatusBadge({ status }: { status: Client['status'] }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function AdminClientsPage() {
  // Server-side query: search (debounced), plan and status filters, page.
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const state = useAsync(
    (signal) =>
      adminReportsService.clients(
        {
          q: q || undefined,
          // "No plan" is not a server-side filter — it is applied on render.
          plan:
            planFilter === 'all' || planFilter === 'none'
              ? undefined
              : (planFilter as SubscriptionPlan),
          status:
            statusFilter === 'all'
              ? undefined
              : (statusFilter as ClientStatus),
          page,
        },
        signal,
      ),
    [q, planFilter, statusFilter, page],
  )

  const hasActiveFilters =
    search.trim() !== '' || planFilter !== 'all' || statusFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setPlanFilter('all')
    setStatusFilter('all')
    setPage(1)
  }

  return (
    <>
      <AdminPageHeader
        title="Clients"
        description="Registered customers, their details, payments and subscription type."
      />

      <AsyncSection state={state} isEmpty={() => false}>
        {(data) => {
          const filtered =
            planFilter === 'none'
              ? data.items.filter((client) => client.plan === null)
              : data.items

          return (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <StatTile
                  label="Total clients"
                  value={data.summary.totalClients}
                />
                <StatTile
                  label="Active subscriptions"
                  value={data.summary.activeSubscriptions}
                />
                <StatTile
                  label="Free accounts"
                  value={data.summary.freeAccounts}
                />
              </div>

              {/* Filters */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3-3" />
                  </svg>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email"
                    aria-label="Search clients"
                    className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Single-select filter dropdowns */}
                <SortDropdown
                  value={planFilter}
                  options={PLAN_FILTER_OPTIONS}
                  onChange={(value) => {
                    setPlanFilter(value)
                    setPage(1)
                  }}
                />
                <SortDropdown
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={(value) => {
                    setStatusFilter(value)
                    setPage(1)
                  }}
                />

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-ink/10 bg-cream/60 text-xs uppercase tracking-wide text-ink-muted">
                      <tr>
                        <th className={TH}>Name</th>
                        <th className={TH}>Email</th>
                        <th className={TH}>Registered</th>
                        <th className={TH}>Plan</th>
                        <th className={TH}>Status</th>
                        <th className={TH}>Renewal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((client) => (
                        <tr
                          key={client.id}
                          className="border-b border-ink/5 transition last:border-0 hover:bg-cream/50"
                        >
                          <td className="px-4 py-3 font-medium text-ink">
                            {client.firstName} {client.lastName}
                          </td>
                          <td className={TD}>{client.email}</td>
                          <td className={TD}>
                            {formatClientDate(client.registeredAt)}
                          </td>
                          <td className={TD}>{planLabel(client.plan)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={client.status} />
                          </td>
                          <td className={TD}>
                            {client.renewsAt
                              ? formatClientDate(client.renewsAt)
                              : '—'}
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-ink-muted"
                          >
                            No clients match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {data.pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-ink-soft">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={data.page <= 1}
                    className="rounded-lg border border-ink/20 px-3 py-1.5 font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span>
                    Page {data.page} of {data.pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={data.page >= data.pages}
                    className="rounded-lg border border-ink/20 px-3 py-1.5 font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )
        }}
      </AsyncSection>
    </>
  )
}
