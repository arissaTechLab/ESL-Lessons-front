import type { Lesson } from '../types/lesson.types'

/**
 * Mocked lesson library. Stands in for admin-managed content until the
 * backend is wired up.
 */
export const LESSONS: readonly Lesson[] = [
  {
    id: 'space-travel',
    title: 'Talking About the Future of Space Travel',
    level: 'upper-intermediate-advanced',
    category: 'Grammar',
    topic: 'Science',
    dateAdded: '2025-05-02',
    isFree: true,
    credits: 1,
    isSeries: true,
  },
  {
    id: 'sleep-science',
    title: 'The Science of Sleep and Daily Habits',
    level: 'intermediate',
    category: 'Story-Based',
    topic: 'Health',
    dateAdded: '2025-04-28',
    isFree: true,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'remote-work',
    title: 'Remote Work and the Future of the Office',
    level: 'multi-level',
    category: 'Podcast-Based',
    topic: 'Business',
    dateAdded: '2025-04-20',
    isFree: true,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'climate-solutions',
    title: 'Climate Solutions People Are Talking About',
    level: 'intermediate-upper-intermediate',
    category: 'Grammar',
    topic: 'Environment',
    dateAdded: '2025-04-15',
    isFree: true,
    credits: 1,
    isSeries: true,
  },
  {
    id: 'ai-everyday',
    title: 'How AI Is Changing Everyday Life',
    level: 'intermediate',
    category: 'Grammar',
    topic: 'Technology',
    dateAdded: '2025-05-01',
    isFree: false,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'street-food',
    title: 'Street Food Culture Around the World',
    level: 'upper-intermediate-advanced',
    category: 'Story-Based',
    topic: 'Food',
    dateAdded: '2025-04-30',
    isFree: false,
    credits: 1,
    isSeries: true,
  },
  {
    id: 'phrasal-travel',
    title: 'Phrasal Verbs for Travelling Abroad',
    level: 'multi-level',
    category: 'Phrasal Verbs',
    topic: 'Travel',
    dateAdded: '2025-04-25',
    isFree: false,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'social-media',
    title: 'Social Media and How We Communicate',
    level: 'intermediate-upper-intermediate',
    category: 'Podcast-Based',
    topic: 'Technology',
    dateAdded: '2025-04-22',
    isFree: false,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'money-habits',
    title: 'Money Habits and Smart Spending',
    level: 'intermediate',
    category: 'Grammar',
    topic: 'Business',
    dateAdded: '2025-04-18',
    isFree: false,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'pronounce-th',
    title: 'Mastering the Tricky “TH” Sound',
    level: 'multi-level',
    category: 'Pronunciation',
    topic: 'Culture',
    dateAdded: '2025-04-12',
    isFree: false,
    credits: 1,
    isSeries: true,
  },
  {
    id: 'wild-places',
    title: 'Exploring the World’s Wildest Places',
    level: 'upper-intermediate-advanced',
    category: 'Story-Based',
    topic: 'Travel',
    dateAdded: '2025-04-08',
    isFree: false,
    credits: 1,
    isSeries: false,
  },
  {
    id: 'healthy-eating',
    title: 'Healthy Eating Without the Hype',
    level: 'intermediate',
    category: 'Podcast-Based',
    topic: 'Health',
    dateAdded: '2025-04-05',
    isFree: false,
    credits: 1,
    isSeries: false,
  },
]

/** Unique category / topic values for the filter dropdowns. */
export const CATEGORY_OPTIONS = [
  ...new Set(LESSONS.map((lesson) => lesson.category)),
].sort()

export const TOPIC_OPTIONS = [
  ...new Set(LESSONS.map((lesson) => lesson.topic)),
].sort()

/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY for display. */
export function formatLessonDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
