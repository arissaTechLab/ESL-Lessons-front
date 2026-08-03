export interface LessonCategory {
  id: string
  title: string
  /** Placeholder copy for the category page header — swap later. */
  subtitle: string
}

/** Cards for the "All lessons: categories" section + their landing pages. */
export const LESSON_CATEGORIES: readonly LessonCategory[] = [
  {
    id: 'story-based',
    title: 'Story-Based Units',
    subtitle:
      'Immersive narratives that get your students predicting, reacting, and talking.',
  },
  {
    id: 'grammar-speaking',
    title: 'Grammar Speaking Lessons',
    subtitle: 'Target grammar in real conversation — spoken, never drilled.',
  },
  {
    id: 'podcast-based',
    title: 'Podcast-Based Units',
    subtitle:
      'Real audio and authentic language to spark discussion in every class.',
  },
  {
    id: 'phrasal-verbs',
    title: 'Phrasal Verb Speaking Lessons',
    subtitle:
      'Master the phrasal verbs native speakers actually use, out loud.',
  },
  {
    id: 'pronunciations',
    title: 'Pronunciations Lessons',
    subtitle: 'Sharpen the trickiest sounds with focused speaking practice.',
  },
  {
    id: 'situational-english',
    title: 'Situational English',
    subtitle: 'Real-world scenarios that prepare students for everyday situations.',
  },
]
