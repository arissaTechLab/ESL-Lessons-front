import type { Article } from '../types/article.types'
import { ArticleCard } from './ArticleCard'

interface ArticleSectionProps {
  title: string
  articles: readonly Article[]
}

/** A titled grid of article cards (2 rows × 4 on large screens). */
export function ArticleSection({ title, articles }: ArticleSectionProps) {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
