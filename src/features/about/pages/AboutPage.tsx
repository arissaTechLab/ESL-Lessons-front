import { PageHeader } from '@/shared/components'
import {
  NoteFromLindsaySection,
  WhyBornSection,
  WhatMakesDifferentSection,
  HowIGotHereSection,
} from '@/features/about/components'
import { CtaSection } from '@/features/landing'

/**
 * Public "About" page — the origin story. Reached from the homepage
 * "About me" section. Reuses the shared marketing CTA from `landing`.
 */
export function AboutPage() {
  return (
    <>
      <PageHeader
        title="Why I Made These Lessons (and Other Long Stories)"
        subtitle="Because sometimes a worksheet just won’t cut it — and neither will a short explanation."
      />
      <NoteFromLindsaySection />
      <WhyBornSection />
      <WhatMakesDifferentSection />
      <HowIGotHereSection />
      <CtaSection />
    </>
  )
}
