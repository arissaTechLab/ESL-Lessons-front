// 📤 Public API of the `lessons` feature.
// Other features/layout must import ONLY from here — never reach into internals.
export { LessonsSection, LessonCard } from './components'
export { LESSONS } from './data/lessons'
export type { Lesson, LessonLevel } from './types/lesson.types'
