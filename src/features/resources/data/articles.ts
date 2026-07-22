import type { Article } from '../types/article.types'

/**
 * Mocked article lists. These stand in for admin-managed blog content until
 * the backend is wired up.
 */
function makeArticles(idPrefix: string, count: number): Article[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i + 1}`,
    category: 'Category',
    title:
      '5-Minute Prep, Full-Class Impact: How to Make ESL Lessons Simpler & Stronger',
    author: 'Lindsay',
    date: 'April 14, 2025',
  }))
}

export const HOW_TO_ARTICLES = makeArticles('how-to', 8)
export const TEACHING_IDEAS_ARTICLES = makeArticles('teaching-ideas', 8)
