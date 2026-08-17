// 📤 Public API of the `lessons` feature.
// Other features/layout must import ONLY from here — never reach into internals.
export { LessonsSection, LessonCard } from './components'
export { lessonsService } from './services/lessons.service'
export {
  AllLessonsPage,
  CategoryPage,
  FreeLessonsPage,
  LessonDetailPage,
} from './pages'
export type {
  LessonCard as LessonCardModel,
  LessonDetail,
  LessonFilters,
  CuratedLessons,
  LessonAccess,
  CefrLevel,
  Taxonomy,
  LessonComment,
} from './types/lesson.types'
