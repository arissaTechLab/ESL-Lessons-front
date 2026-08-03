/** Presentational success toast. Visibility/timing is managed by the parent. */
export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-cream shadow-lg"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 text-emerald-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 5 5L20 7" />
      </svg>
      {message}
    </div>
  )
}
