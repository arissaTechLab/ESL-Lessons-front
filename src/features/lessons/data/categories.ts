export interface LessonCategory {
  id: string
  title: string
  /** CEFR levels this category covers, shown under the title. */
  levels: string
  /** Card image (lives in /public). */
  image: string
  /** Placeholder copy for the category page header — swap later. */
  subtitle: string
}

/**
 * Cards for the "All lessons: categories" section + their landing pages.
 * Order here is the order shown on the page.
 */
export const LESSON_CATEGORIES: readonly LessonCategory[] = [
  {
    id: 'podcast-based',
    title: 'Podcast-Based Units',
    levels: 'B2 – C1',
    image: '/podcast-based-img.png',
    subtitle:
      'Real audio and authentic language to spark discussion in every class.',
  },
  {
    id: 'story-based',
    title: 'Story-Based Units',
    levels: 'B1 – B2',
    image: '/story-based-img.png',
    subtitle:
      'Immersive narratives that get your students predicting, reacting, and talking.',
  },
  {
    id: 'beginner-sequenced',
    title: 'Beginner Sequenced Units',
    levels: 'A1 – A2',
    image: '/beginner-sequenced-img.png',
    subtitle:
      'Step-by-step units that build confidence from the very first words.',
  },
  {
    id: 'grammar-speaking',
    title: 'Grammar Speaking Lessons',
    levels: 'B1 · B2 · C1',
    image: '/grammar-speaking-img.png',
    subtitle: 'Target grammar in real conversation — spoken, never drilled.',
  },
  {
    id: 'phrasal-verbs',
    title: 'Phrasal Verb Deep Dives',
    levels: 'B1 · B2 · C1',
    image: '/phrasal-verbs-img.png',
    subtitle:
      'Master the phrasal verbs native speakers actually use, out loud.',
  },
  {
    id: 'situational-english',
    title: 'Situational English',
    levels: 'A2 · B1 · B2',
    image: '/situational-english-img.png',
    subtitle: 'Real-world scenarios that prepare students for everyday situations.',
  },
  {
    id: 'pronunciations',
    title: 'Pronunciation Lessons',
    levels: 'B1 · B2 · C1',
    image: '/pronunciation-img.png',
    subtitle: 'Sharpen the trickiest sounds with focused speaking practice.',
  },
]
