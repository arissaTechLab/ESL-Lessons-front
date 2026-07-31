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
  intermediate: {
    label: 'Intermediate',
    tags: ['B1'],
    bg: '#e0f2fe',
    text: '#0c4a6e',
  },
  'upper-intermediate-advanced': {
    label: 'Upper-Intermediate & Advanced',
    tags: ['B2', 'C1'],
    bg: '#fef3c7',
    text: '#78350f',
  },
  'multi-level': {
    label: 'Multi-Level',
    tags: ['B1', 'B2', 'C1'],
    bg: '#ffe4e6',
    text: '#881337',
  },
  'intermediate-upper-intermediate': {
    label: 'Intermediate & Upper-Intermediate',
    tags: ['B1', 'B2'],
    bg: '#d1fae5',
    text: '#064e3b',
  },
}
