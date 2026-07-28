/** Filter option sets shown in the custom filter dropdowns. */

/** CEFR levels — matched against each lesson's level tags. */
export const CEFR_LEVELS = [
  { value: 'B1', label: 'B1 (Intermediate)' },
  { value: 'B2', label: 'B2 (Upper-Intermediate)' },
  { value: 'C1', label: 'C1 (Advanced)' },
] as const

export const CATEGORY_FILTER_OPTIONS = [
  'Podcast-Based Units',
  'Story-Based Units',
  'Grammar Speaking Lessons',
  'Phrasal Verb Speaking Lessons',
  'Pronunciations Lessons',
] as const

/** Special topic option that filters by free access instead of a topic. */
export const FREE_LESSONS_TOPIC = 'Free Lessons'

export const TOPIC_FILTER_OPTIONS = [
  FREE_LESSONS_TOPIC,
  'Health & Wellness',
  'Human Interest',
  'Science & Technology',
  'Arts & Entertainment',
  'Business',
] as const
