import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Ignore storage failures (e.g. private mode); the UI still works.
  }
}

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  // The inline script in index.html already applied the correct class pre-paint.
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

/**
 * Global UI theme store (Zustand). Persists to localStorage and keeps the
 * `.dark` class on <html> in sync — shared across every feature.
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
