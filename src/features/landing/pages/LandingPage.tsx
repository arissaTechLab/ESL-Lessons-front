import {
  Hero,
  WhatIOfferSection,
  HowToUseSection,
  StatsSection,
  AboutSection,
  TestimonialsSection,
  CtaSection,
} from '@/features/landing/components'

/**
 * Public landing page. Composes the landing sections top-to-bottom:
 * hero → offer → how-to-use → stats → about → testimonials → CTA.
 */
export function LandingPage() {
  return (
    <>
      <Hero />
      <WhatIOfferSection />
      <HowToUseSection />
      <StatsSection />
      <AboutSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
