import { create } from 'zustand'

export type ToastTone = 'success' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface ToastState {
  toasts: Toast[]
  notify: (message: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

let nextId = 1

/**
 * Confirmation messages for the admin panel (save, delete, publish...).
 * Toasts auto-dismiss; `dismiss` exists so the close button can act early.
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  notify: (message, tone = 'success') => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }))
    setTimeout(
      () =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      4000,
    )
  },

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))
