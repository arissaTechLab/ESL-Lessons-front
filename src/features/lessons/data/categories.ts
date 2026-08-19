export interface LessonCategory {
  id: string
  title: string
  /** CEFR levels this category covers, shown under the title. */
  levels: string
  /** Card image (lives in /public). */
  image: string
  /** Category icon (SVG in /public) — raw path, encode when used as a URL. */
  icon: string
  /** Placeholder copy for the category page header — swap later. */
  subtitle: string
}

const ICON_DIR = '/iconos categorías'

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
    icon: `${ICON_DIR}/podcast-based.svg`,
    subtitle:
      'Real audio and authentic language to spark discussion in every class.',
  },
  {
    id: 'story-based',
    title: 'Story-Based Units',
    levels: 'B1 – B2',
    image: '/story-based-img.png',
    icon: `${ICON_DIR}/story-based.svg`,
    subtitle:
      'Immersive narratives that get your students predicting, reacting, and talking.',
  },
  {
    id: 'beginner-sequenced',
    title: 'Beginner Sequenced Units',
    levels: 'A1 – A2',
    image: '/beginner-sequenced-img.png',
    icon: `${ICON_DIR}/beginner sequenced.svg`,
    subtitle:
      'Step-by-step units that build confidence from the very first words.',
  },
  {
    id: 'grammar-speaking',
    title: 'Grammar Speaking Lessons',
    levels: 'B1 · B2 · C1',
    image: '/grammar-speaking-img.png',
    icon: `${ICON_DIR}/grammar.svg`,
    subtitle: 'Target grammar in real conversation — spoken, never drilled.',
  },
  {
    id: 'phrasal-verbs',
    title: 'Phrasal Verb Deep Dives',
    levels: 'B1 · B2 · C1',
    image: '/phrasal-verbs-img.png',
    icon: `${ICON_DIR}/phrasal verb.svg`,
    subtitle:
      'Master the phrasal verbs native speakers actually use, out loud.',
  },
  {
    id: 'situational-english',
    title: 'Situational English',
    levels: 'A2 · B1 · B2',
    image: '/situational-english-img.png',
    icon: `${ICON_DIR}/situational.svg`,
    subtitle: 'Real-world scenarios that prepare students for everyday situations.',
  },
  {
    id: 'pronunciations',
    title: 'Pronunciation Lessons',
    levels: 'B1 · B2 · C1',
    image: '/pronunciation-img.png',
    icon: `${ICON_DIR}/pronunciation.svg`,
    subtitle: 'Sharpen the trickiest sounds with focused speaking practice.',
  },
]

/**
 * Icon per lesson category value (matches `lesson.category`). Used on lesson
 * cards. Raw paths — encode with `encodeURI` before using as a URL.
 */
export const CATEGORY_ICONS: Record<string, string> = {
  'Podcast-Based Units': `${ICON_DIR}/podcast-based.svg`,
  'Story-Based Units': `${ICON_DIR}/story-based.svg`,
  'Grammar Speaking Lessons': `${ICON_DIR}/grammar.svg`,
  'Phrasal Verb Speaking Lessons': `${ICON_DIR}/phrasal verb.svg`,
  'Pronunciations Lessons': `${ICON_DIR}/pronunciation.svg`,
  'Situational English': `${ICON_DIR}/situational.svg`,
}
