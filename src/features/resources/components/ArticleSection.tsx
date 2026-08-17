import { AsyncSection } from '@/shared/components'
import { useAsync } from '@/hooks'
import { articlesService } from '@/features/resources/services/articles.service'
import type { ArticleSection as Section } from '@/features/resources/types/article.types'
import { ArticleCard } from './ArticleCard'

interface ArticleSectionProps {
  title: string
  /** Which admin-managed grid to pull. */
  section: Section
  limit?: number
}

/** A titled grid of article cards (2 rows × 4 on large screens), loaded live. */
export function ArticleSection({ title, section, limit = 8 }: ArticleSectionProps) {
  const state = useAsync(
    (signal) => articlesService.list({ section, limit }, signal),
    [section, limit],
  )

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h2>

        <div className="mt-8">
          <AsyncSection
            state={state}
            isEmpty={(page) => page.items.length === 0}
            empty={
              <p className="py-6 text-sm text-ink-muted">
                No articles published in this section yet.
              </p>
            }
          >
            {(page) => (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {page.items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </AsyncSection>
        </div>
      </div>
    </section>
  )
}
