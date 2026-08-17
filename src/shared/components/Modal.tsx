import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Rendered in the footer, right-aligned. */
  footer?: ReactNode
  size?: 'sm' | 'lg'
}

/** Centered dialog with a scrim. Escape closes it and the body stops scrolling. */
export function Modal({
  isOpen,
  title,
  onClose,
  children,
  footer,
  size = 'sm',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`w-full rounded-2xl bg-cream p-6 shadow-xl ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'}`}
        // The scrim closes the dialog; clicks inside must not bubble up to it.
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
        <div className="mt-4 text-sm text-ink-soft">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  isBusy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Destructive-action confirmation used before every delete in the admin panel. */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-ink/30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isBusy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      {message}
    </Modal>
  )
}
