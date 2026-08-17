import { useToastStore } from '@/store/toast.store'

/** Renders the toast stack. Mounted once per layout, bottom-right. */
export function ToastViewport() {
  const { toasts, dismiss } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-accent-300 bg-white text-ink'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss"
            className="text-ink-muted transition hover:text-ink"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
