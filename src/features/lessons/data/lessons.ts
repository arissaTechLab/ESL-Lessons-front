import type { Lesson } from '../types/lesson.types'

/**
 * Mocked lesson library. Stands in for admin-managed content until the
 * backend is wired up. `category` / `topic` values match the filter options
 * in `./filters`.
 */
export const LESSONS: readonly Lesson[] = [
  {
    id: 'space-travel',
    title: 'Talking About the Future of Space Travel',
    level: 'upper-intermediate-advanced',
    category: 'Grammar Speaking Lessons',
    topic: 'Science & Technology',
    dateAdded: '2025-05-02',
    isFree: true,
    isSeries: true,
    status: 'published',
  },
  {
    id: 'sleep-science',
    title: 'The Science of Sleep and Daily Habits',
    level: 'intermediate',
    category: 'Story-Based Units',
    topic: 'Health & Wellness',
    dateAdded: '2025-04-28',
    isFree: true,
    isSeries: false,
    status: 'published',
  },
  {
    id: 'remote-work',
    title: 'Remote Work and the Future of the Office',
    level: 'multi-level',
    category: 'Podcast-Based Units',
    topic: 'Business',
    dateAdded: '2025-04-20',
    isFree: true,
    isSeries: false,
    status: 'published',
  },
  {
    id: 'climate-solutions',
    title: 'Climate Solutions People Are Talking About',
    level: 'intermediate-upper-intermediate',
    category: 'Grammar Speaking Lessons',
    topic: 'Science & Technology',
    dateAdded: '2025-04-15',
    isFree: true,
    isSeries: true,
    status: 'published',
  },
  {
    id: 'ai-everyday',
    title: 'How AI Is Changing Everyday Life',
    level: 'beginner-elementary',
    category: 'Grammar Speaking Lessons',
    topic: 'Science & Technology',
    dateAdded: '2025-05-01',
    isFree: false,
    isSeries: false,
    status: 'draft',
  },
  {
    id: 'street-food',
    title: 'Street Food Culture Around the World',
    level: 'upper-intermediate-advanced',
    category: 'Story-Based Units',
    topic: 'Human Interest',
    dateAdded: '2025-04-30',
    isFree: false,
    isSeries: true,
    status: 'published',
  },
  {
    id: 'phrasal-travel',
    title: 'Phrasal Verbs for Travelling Abroad',
    level: 'multi-level',
    category: 'Phrasal Verb Speaking Lessons',
    topic: 'Human Interest',
    dateAdded: '2025-04-25',
    isFree: false,
    isSeries: false,
    status: 'draft',
  },
  {
    id: 'social-media',
    title: 'Social Media and How We Communicate',
    level: 'intermediate-upper-intermediate',
    category: 'Podcast-Based Units',
    topic: 'Science & Technology',
    dateAdded: '2025-04-22',
    isFree: false,
    isSeries: false,
    status: 'published',
  },
  {
    id: 'money-habits',
    title: 'Money Habits and Smart Spending',
    level: 'intermediate',
    category: 'Grammar Speaking Lessons',
    topic: 'Business',
    dateAdded: '2025-04-18',
    isFree: false,
    isSeries: false,
    status: 'published',
  },
  {
    id: 'pronounce-th',
    title: 'Mastering the Tricky “TH” Sound',
    level: 'multi-level',
    category: 'Pronunciations Lessons',
    topic: 'Arts & Entertainment',
    dateAdded: '2025-04-12',
    isFree: false,
    isSeries: true,
    status: 'draft',
  },
  {
    id: 'wild-places',
    title: 'Exploring the World’s Wildest Places',
    level: 'beginner-elementary',
    category: 'Story-Based Units',
    topic: 'Arts & Entertainment',
    dateAdded: '2025-04-08',
    isFree: false,
    isSeries: false,
    status: 'published',
  },
  {
    id: 'healthy-eating',
    title: 'Healthy Eating Without the Hype',
    level: 'intermediate',
    category: 'Podcast-Based Units',
    topic: 'Health & Wellness',
    dateAdded: '2025-04-05',
    isFree: false,
    isSeries: false,
    status: 'published',
  },
]

/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY for display. */
export function formatLessonDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** Look up a lesson by its id. */
export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}
