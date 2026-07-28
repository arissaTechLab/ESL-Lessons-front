import type { LessonLevel } from '../types/lesson.types'

export interface LevelMeta {
  label: string
  /** CEFR tags shown inside the badge. */
  tags: readonly string[]
  /** Tailwind classes for the badge color. */
  badgeClass: string
}

export const LEVEL_META: Record<LessonLevel, LevelMeta> = {
  intermediate: {
    label: 'Intermediate',
    tags: ['B1'],
    badgeClass: 'bg-sky-100 text-sky-900',
  },
  'upper-intermediate-advanced': {
    label: 'Upper-Intermediate & Advanced',
    tags: ['B2', 'C1'],
    badgeClass: 'bg-amber-100 text-amber-900',
  },
  'multi-level': {
    label: 'Multi-Level',
    tags: ['B1', 'B2', 'C1'],
    badgeClass: 'bg-rose-100 text-rose-900',
  },
  'intermediate-upper-intermediate': {
    label: 'Intermediate & Upper-Intermediate',
    tags: ['B1', 'B2'],
    badgeClass: 'bg-emerald-100 text-emerald-900',
  },
}

/** Options for the level filter dropdown. */
export const LEVEL_OPTIONS = (
  Object.keys(LEVEL_META) as LessonLevel[]
).map((value) => ({ value, label: LEVEL_META[value].label }))
