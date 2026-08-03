export type BlogStatus = 'published' | 'draft'

export interface BlogPost {
  id: string
  title: string
  /** Body text of the post. */
  text: string
  status: BlogStatus
  /** ISO date (YYYY-MM-DD). */
  date: string
}
