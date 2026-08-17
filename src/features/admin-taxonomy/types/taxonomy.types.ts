import type { CefrLevel } from '@/features/lessons'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  isActive: boolean
}

export interface Topic {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
}

/** A level owns its badge colours — cards and tables render them as-is. */
export interface Level {
  id: string
  name: string
  slug: string
  cefr: CefrLevel[]
  color: string
  textColor: string
  order: number
}

/** One call feeds the three admin panels and every lesson-form select. */
export interface TaxonomySnapshot {
  categories: Category[]
  levels: Level[]
  topics: Topic[]
}

export interface CreateCategoryPayload {
  name: string
  description?: string
}

export interface CreateTopicPayload {
  name: string
}

export interface CreateLevelPayload {
  name: string
  cefr: CefrLevel[]
  color: string
  textColor?: string
}
