import { Link } from 'react-router-dom'

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
    </svg>
  )
}

/** Edit link + delete button for admin table rows. */
export function AdminRowActions({
  editTo,
  onDelete,
  label,
}: {
  editTo: string
  onDelete: () => void
  label: string
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={editTo}
        aria-label={`Edit ${label}`}
        className="grid size-8 place-items-center rounded-lg text-ink-soft transition hover:bg-ink/5 hover:text-brand-600"
      >
        <EditIcon />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${label}`}
        className="grid size-8 place-items-center rounded-lg text-ink-soft transition hover:bg-rose-50 hover:text-rose-600"
      >
        <TrashIcon />
      </button>
    </div>
  )
}
