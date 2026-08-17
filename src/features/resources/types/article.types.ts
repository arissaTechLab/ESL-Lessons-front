/** The two article grids on the "How to & Teaching Ideas" page. */
export type ArticleSection = 'how-to' | 'teaching-ideas'

/** A blog-style article, managed from the admin panel's Blog section. */
export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl: string | null
  authorName: string
  category: string
  section: ArticleSection
  publishedAt: string | null
}

export interface ArticleDetail extends Article {
  content: string
}
