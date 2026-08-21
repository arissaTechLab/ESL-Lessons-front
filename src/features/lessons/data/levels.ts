import type { LessonLevel } from '../types/lesson.types'

export interface LevelMeta {
  label: string
  /** CEFR tags shown inside the badge. */
  tags: readonly string[]
  /** Badge background color (hex) — swap these to restyle a level. */
  bg: string
  /** Badge text color (hex). */
  text: string
}

/**
 * Predetermined color per level. Change the hex values here and every lesson
 * card + badge updates automatically.
 */
export const LEVEL_META: Record<LessonLevel, LevelMeta> = {
  'beginner-elementary': {
    label: 'Beginner & Elementary',
    tags: ['A1', 'A2'],
    bg: '#e9e0f6',
    text: '#27170c',
  },
  intermediate: {
    label: 'Lower-Intermediate',
    tags: ['B1'],
    bg: '#e1d5c9',
    text: '#27170c',
  },
  'intermediate-upper-intermediate': {
    label: 'Intermediate & Upper-Intermediate',
    tags: ['B1', 'B2'],
    bg: '#cce3e9',
    text: '#27170c',
  },
  'upper-intermediate-advanced': {
    label: 'Upper-Intermediate & Advanced',
    tags: ['B2', 'C1'],
    bg: '#ffeeb1',
    text: '#27170c',
  },
  'multi-level': {
    label: 'Multilevel',
    tags: ['B1', 'B2', 'C1'],
    bg: '#eac3c7',
    text: '#27170c',
  },
}

/** Level options for forms (value + human label). */
export const LESSON_LEVEL_OPTIONS = Object.entries(LEVEL_META).map(
  ([value, meta]) => ({ value, label: meta.label }),
)

/** Neutral styling for a level created in Taxonomy after this map was written. */
const FALLBACK_LEVEL_META: LevelMeta = {
  label: 'Level',
  tags: [],
  bg: '#e5e0d8',
  text: '#27170c',
}

/**
 * Resolves how a level should look. Prefers what the API sent (levels and
 * their colours are managed from admin Taxonomy); falls back to the seeded
 * map, then to neutral styling, so an unknown level can never crash a card.
 */
export function resolveLevelMeta(
  level: string,
  meta?: LevelMeta,
): LevelMeta {
  return meta ?? LEVEL_META[level] ?? FALLBACK_LEVEL_META
}
