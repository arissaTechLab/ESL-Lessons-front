import { create } from 'zustand'
import { CATEGORY_FILTER_OPTIONS, LESSON_TOPIC_OPTIONS } from '../data/filters'
import { LEVEL_META } from '../data/levels'
import type { LessonLevel } from '../types/lesson.types'

export interface TaxonomyLevel {
  id: string
  label: string
  /** CEFR tags shown inside the level badge. */
  tags: string[]
  /** Badge background color (hex). */
  bg: string
  /** Badge text color (hex). */
  text: string
}

let levelSeq = 100
const nextLevelId = () => `lvl-${(levelSeq += 1)}`

const exists = (list: readonly string[], name: string) =>
  list.some((item) => item.toLowerCase() === name.toLowerCase())

interface TaxonomyState {
  categories: string[]
  topics: string[]
  levels: TaxonomyLevel[]
  addCategory: (name: string) => void
  removeCategory: (name: string) => void
  addTopic: (name: string) => void
  removeTopic: (name: string) => void
  addLevel: (level: Omit<TaxonomyLevel, 'id'>) => void
  removeLevel: (id: string) => void
}

/**
 * The lesson taxonomy (categories, levels, topics) available when creating a
 * lesson. Managed from the admin "Taxonomy" section. Seeded from the static
 * option sets; session-scoped mock (resets on reload) until the backend lands.
 */
export const useTaxonomyStore = create<TaxonomyState>((set) => ({
  categories: [...CATEGORY_FILTER_OPTIONS],
  topics: [...LESSON_TOPIC_OPTIONS],
  levels: (Object.keys(LEVEL_META) as LessonLevel[]).map((id) => ({
    id,
    label: LEVEL_META[id].label,
    tags: [...LEVEL_META[id].tags],
    bg: LEVEL_META[id].bg,
    text: LEVEL_META[id].text,
  })),

  addCategory: (name) =>
    set((s) =>
      exists(s.categories, name)
        ? s
        : { categories: [...s.categories, name] },
    ),
  removeCategory: (name) =>
    set((s) => ({ categories: s.categories.filter((c) => c !== name) })),

  addTopic: (name) =>
    set((s) => (exists(s.topics, name) ? s : { topics: [...s.topics, name] })),
  removeTopic: (name) =>
    set((s) => ({ topics: s.topics.filter((t) => t !== name) })),

  addLevel: (level) =>
    set((s) =>
      exists(
        s.levels.map((l) => l.label),
        level.label,
      )
        ? s
        : { levels: [...s.levels, { ...level, id: nextLevelId() }] },
    ),
  removeLevel: (id) =>
    set((s) => ({ levels: s.levels.filter((l) => l.id !== id) })),
}))
