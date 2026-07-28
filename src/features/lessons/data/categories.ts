export interface LessonCategory {
  id: string
  title: string
}

/** Cards for the "All lessons: categories" section. */
export const LESSON_CATEGORIES: readonly LessonCategory[] = [
  { id: 'story-based', title: 'Story-Based Units' },
  { id: 'grammar-speaking', title: 'Grammar Speaking Lessons' },
  { id: 'podcast-based', title: 'Podcast-Based Units' },
  { id: 'phrasal-verbs', title: 'Phrasal Verb Deep Dives' },
  { id: 'pronunciation', title: 'Pronunciation Lessons' },
]
