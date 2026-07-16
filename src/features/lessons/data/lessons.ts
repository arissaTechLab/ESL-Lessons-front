import type { Lesson } from '@/features/lessons/types/lesson.types'

export const LESSONS: readonly Lesson[] = [
  {
    id: 'greetings',
    title: 'Greetings & Introductions',
    level: 'Beginner',
    description:
      'Say hello, introduce yourself, and start simple conversations.',
    durationMin: 15,
    emoji: '👋',
  },
  {
    id: 'daily-routines',
    title: 'Daily Routines',
    level: 'Beginner',
    description: 'Talk about your day using the present simple tense.',
    durationMin: 20,
    emoji: '☀️',
  },
  {
    id: 'past-stories',
    title: 'Telling Past Stories',
    level: 'Intermediate',
    description: 'Narrate events with the past simple and continuous tenses.',
    durationMin: 25,
    emoji: '📖',
  },
  {
    id: 'phrasal-verbs',
    title: 'Everyday Phrasal Verbs',
    level: 'Intermediate',
    description: 'Master the phrasal verbs native speakers use every day.',
    durationMin: 30,
    emoji: '🔗',
  },
  {
    id: 'debate',
    title: 'Debating & Opinions',
    level: 'Advanced',
    description: 'Express, defend, and challenge opinions with confidence.',
    durationMin: 35,
    emoji: '💬',
  },
  {
    id: 'idioms',
    title: 'Idioms & Nuance',
    level: 'Advanced',
    description: 'Sound natural with idiomatic expressions and subtle meaning.',
    durationMin: 30,
    emoji: '✨',
  },
]
