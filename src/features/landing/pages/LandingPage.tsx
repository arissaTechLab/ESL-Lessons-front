import { Hero, FeaturesSection } from '@/features/landing/components'
import { LessonsSection } from '@/features/lessons'

/**
 * Public landing page. Composes the landing sections with the `lessons`
 * feature — imported through its public API, never its internals.
 */
export function LandingPage() {
  return (
    <>
      <Hero />
      <LessonsSection />
      <FeaturesSection />
    </>
  )
}
