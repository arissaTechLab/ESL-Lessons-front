export function StatTile({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-ink">{value}</p>
    </div>
  )
}
