import { AsyncSection, PageHeader, Button } from '@/shared/components'
import { useAsync } from '@/hooks'
import { CtaSection } from '@/features/landing'
import {
  LessonAccessSection,
  ArticleSection,
} from '@/features/resources/components'
import { articlesService } from '@/features/resources/services/articles.service'

/**
 * "How to & Teaching Ideas" resource page. The card grids are blog-style
 * articles that the admin will manage once the backend is wired up.
 */
export function TeachingIdeasPage() {
  const howTo = useAsync((signal) => articlesService.bySection('how-to', signal))
  const teachingIdeas = useAsync((signal) =>
    articlesService.bySection('teaching-ideas', signal),
  )

  return (
    <>
      <PageHeader
        title="How to & Teaching Ideas"
        subtitle="Because sometimes a worksheet just won’t cut it — and neither will a short explanation."
      />

      <LessonAccessSection title="Using the lessons">
        <p>
          For our free lessons, you can unlock all the lesson materials,
          including the Google Slide E-Lesson after registering an account (also
          for free). For all other lessons, you should have{' '}
          <a href="#" className="underline transition hover:text-brand-600">
            credits or a full access account
          </a>{' '}
          in order to access them.
        </p>
        <p>
          Whenever you open the link for a Google Slide E-Lesson, you will be
          requested to ‘Make a copy’. Please click and confirm this in order to
          access the lesson.
        </p>
        <p>
          Once you make a copy of the lesson, you can also easily share the
          lesson with your students by sending them the URL link, or by clicking
          the share button in the top right. However, sharing the lesson with
          students often isn’t necessary until the end since you’ll be the one
          controlling the screen (this is discussed a bit below).
        </p>
      </LessonAccessSection>

      <AsyncSection state={howTo}>
        {(articles) => (
          <ArticleSection title="How to Use These Lessons" articles={articles} />
        )}
      </AsyncSection>
      <AsyncSection state={teachingIdeas}>
        {(articles) => (
          <ArticleSection title="Method & Teaching Ideas" articles={articles} />
        )}
      </AsyncSection>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Button variant="tertiary" className="w-full">
          Load more lessons
        </Button>
      </div>

      <CtaSection />
    </>
  )
}
