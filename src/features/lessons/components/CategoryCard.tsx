import { Placeholder, buttonVariants } from '@/shared/components'
import type { LessonCategory } from '../data/categories'

/** Category card for the "All lessons: categories" section. */
export function CategoryCard({ category }: { category: LessonCategory }) {
  return (
    <article className="overflow-hidden rounded-xl border border-ink/10 bg-cream">
      <Placeholder
        label=""
        className="aspect-[16/7] w-full rounded-none border-0"
      />
      <div className="p-4 text-center">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
          {category.title}
        </h3>
        <a
          href="#"
          className={buttonVariants('secondary', 'md', 'mt-3 w-full')}
        >
          Explore lessons
        </a>
      </div>
    </article>
  )
}
