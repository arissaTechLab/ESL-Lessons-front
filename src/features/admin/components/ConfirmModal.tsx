import type { ReactNode } from 'react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Centered confirmation dialog for destructive actions. */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
        <div className="mt-2 text-sm text-ink-soft">{message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
