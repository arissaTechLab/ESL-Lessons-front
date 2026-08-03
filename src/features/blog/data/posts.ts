import type { BlogPost } from '../types/blog.types'

/**
 * Mocked blog / teaching-idea posts. Stands in for admin-managed content until
 * the backend is wired up.
 */
export const BLOG_POSTS: readonly BlogPost[] = [
  {
    id: 'prep-smarter',
    title: '5-Minute Prep, Full-Class Impact: How to Make ESL Lessons Simpler',
    text: 'A quick look at how a little structure turns last-minute scrambles into confident, engaging lessons.',
    status: 'published',
    date: '2025-04-14',
  },
  {
    id: 'gifs-speaking',
    title: 'Why GIFs and Images Beat Word Lists for Speaking Practice',
    text: 'Visual prompts get students talking naturally — here’s how to build a lesson around them.',
    status: 'published',
    date: '2025-04-10',
  },
  {
    id: 'walk-and-talk',
    title: 'The “Walk & Talk” Review: Movement That Sticks',
    text: 'A simple format that changes the energy of an online class and reinforces vocabulary.',
    status: 'draft',
    date: '2025-04-06',
  },
  {
    id: 'podcast-lessons',
    title: 'Turning Podcasts Into Ready-to-Teach Conversations',
    text: 'How to pick clips and frame questions that spark real discussion.',
    status: 'published',
    date: '2025-03-30',
  },
  {
    id: 'phrasal-verbs',
    title: 'Teaching Phrasal Verbs Without the Worksheet Fatigue',
    text: 'Image-based context beats memorising lists — a repeatable approach for any level.',
    status: 'draft',
    date: '2025-03-22',
  },
  {
    id: 'charge-your-worth',
    title: 'Charging Professional Rates as an Independent ESL Teacher',
    text: 'Structured, polished materials let you teach with confidence and price accordingly.',
    status: 'published',
    date: '2025-03-15',
  },
]

/** Look up a post by its id. */
export function getPostById(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.id === id)
}

/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY for display. */
export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
