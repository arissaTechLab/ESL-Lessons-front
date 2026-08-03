import { AdminPageHeader } from '@/features/admin/components'

/** Placeholder metric tiles — the actual metrics are still to be defined. */
function MetricPlaceholder() {
  return (
    <div className="rounded-xl border-2 border-dashed border-ink/15 bg-white/50 p-5">
      <div className="h-3 w-24 rounded bg-ink/10" />
      <div className="mt-3 h-7 w-16 rounded bg-ink/10" />
      <p className="mt-3 text-xs text-ink-muted">Metric to define</p>
    </div>
  )
}

export function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your platform at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPlaceholder />
        <MetricPlaceholder />
        <MetricPlaceholder />
        <MetricPlaceholder />
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        We’ll define which metrics to show here together.
      </p>
    </>
  )
}
