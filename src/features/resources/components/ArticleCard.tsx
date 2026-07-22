import { Placeholder } from '@/shared/components'
import type { Article } from '../types/article.types'

/** Blog-style card used in the resource article grids. */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col rounded-xl border border-ink/10 bg-cream p-3 transition hover:shadow-md">
      <Placeholder label="Photo" className="aspect-[16/10] w-full rounded-lg" />

      <div className="mt-3 flex flex-1 flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {article.category}
        </span>
        <h3 className="mt-2 font-heading text-sm font-semibold leading-snug text-ink">
          {article.title}
        </h3>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <span
            className="size-6 shrink-0 rounded-full bg-accent-300"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-ink">{article.author}</span>
          <span className="text-xs text-ink-muted">{article.date}</span>
        </div>
      </div>
    </article>
  )
}
