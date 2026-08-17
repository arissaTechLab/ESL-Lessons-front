/** A lesson linked from a grammar point — just enough to render a link. */
export interface GrammarLessonRef {
  id: string
  slug: string
  title: string
}

/** One row of the public grammar index, managed by the admin. */
export interface GrammarPoint {
  id: string
  title: string
  cefr: string[]
  order: number
  lessons: GrammarLessonRef[]
}
