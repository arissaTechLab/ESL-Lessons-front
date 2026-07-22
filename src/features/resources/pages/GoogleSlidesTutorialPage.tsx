import { PageHeader } from '@/shared/components'
import { CtaSection } from '@/features/landing'
import {
  LessonAccessSection,
  EditorSlideshowSection,
} from '@/features/resources/components'

/**
 * Fixed "Google Slides Tutorial" resource page — static instructional content.
 */
export function GoogleSlidesTutorialPage() {
  return (
    <>
      <PageHeader
        title="Google Slides Tutorial"
        subtitle="Learn how to teach our lessons with ease using Google Slides — tips, features, and step-by-step guidance included."
      />

      <LessonAccessSection title="How to Use These Lessons">
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
      </LessonAccessSection>

      <EditorSlideshowSection />

      <CtaSection />
    </>
  )
}
