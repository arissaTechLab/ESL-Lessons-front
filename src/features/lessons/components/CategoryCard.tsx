import { Link } from 'react-router-dom'
import { Placeholder, buttonVariants } from '@/shared/components'
import { lessonCategoryPath } from '@/config/routes.constants'
import type { LessonCategory } from '../data/categories'

/** Category card for the "All lessons: categories" section. */
export function CategoryCard({ category }: { category: LessonCategory }) {
  return (
    <article className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl">
      <Placeholder
        label=""
        className="aspect-[16/7] w-full rounded-none border-0"
      />
      <div className="p-4 text-center">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
          {category.title}
        </h3>
        <Link
          to={lessonCategoryPath(category.id)}
          className={buttonVariants('secondary', 'md', 'mt-3 w-full')}
        >
          Explore lessons
        </Link>
      </div>
    </article>
  )
}
