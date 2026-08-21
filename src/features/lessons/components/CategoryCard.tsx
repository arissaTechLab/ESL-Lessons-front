import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components'
import { lessonCategoryPath } from '@/config/routes.constants'
import type { LessonCategory } from '../types/lesson.types'

/** Category card for the "All lessons: categories" section. */
export function CategoryCard({ category }: { category: LessonCategory }) {
  return (
    <article className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl">
      <div className="relative">
        <img
          src={category.image}
          alt={category.title}
          className="aspect-[16/7] w-full object-cover"
        />
        {/* Category icon (white SVG on the black box). */}
        <span
          className="absolute left-3 top-3 grid size-10 place-items-center rounded-md border-2 border-white bg-ink text-white shadow-md"
          title={category.title}
        >
          <img src={encodeURI(category.icon)} alt="" className="size-6" />
        </span>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
          {category.title}
        </h3>
        <p className="mt-1 font-heading text-sm font-semibold tracking-wide text-brand-600">
          {category.levels}
        </p>
        <Link
          to={lessonCategoryPath(category.slug)}
          className={buttonVariants('secondary', 'md', 'mt-3 w-full')}
        >
          Explore lessons
        </Link>
      </div>
    </article>
  )
}
