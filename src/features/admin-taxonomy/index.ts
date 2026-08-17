// 📤 Public API of the `admin-taxonomy` feature.
export { TaxonomyPage } from './pages'
export { taxonomyService } from './services/taxonomy.service'
export { LevelBadge } from './components/LevelBadge'
export type {
  Category,
  Topic,
  Level,
  TaxonomySnapshot,
  CreateCategoryPayload,
  CreateTopicPayload,
  CreateLevelPayload,
} from './types/taxonomy.types'
